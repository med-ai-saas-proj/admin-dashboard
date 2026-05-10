import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import {
	updateAdminProjectOrganization,
	type UpdateAdminProjectOrganizationCredentials,
} from "../services/update-admin-project-organization";
import type {
	UpdateAdminProjectOrganizationResponse,
	AdminProjectOrganization,
	AdminProjectsOrganizationResponse,
} from "../types/admin-projects";

export const useUpdateAdminProjectOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["update-admin-project-organization"],
		mutationFn: (credentials: UpdateAdminProjectOrganizationCredentials) =>
			updateAdminProjectOrganization(credentials),
		onMutate: async (credentials) => {
			await queryClient.cancelQueries({
				queryKey: ["admin-projects-organization"],
				exact: false,
			});

			const previous = queryClient.getQueriesData({
				queryKey: ["admin-projects-organization"],
				exact: false,
			}) as Array<
				[QueryKey, UpdateAdminProjectOrganizationResponse | undefined]
			>;

			previous.forEach(([key]) => {
				queryClient.setQueryData<
					| UpdateAdminProjectOrganizationResponse
					| AdminProjectsOrganizationResponse
					| undefined
				>(
					key,
					(
						old:
							| UpdateAdminProjectOrganizationResponse
							| AdminProjectsOrganizationResponse
							| undefined
					) => {
						const cache = old;

						// No cached value: return a minimal single-item optimistic response
						if (!cache) {
							return {
								success: true,
								data: {
									project_uuid: credentials.projectId,
									name: credentials.name,
									description: credentials.description,
									organization_id: "",
									archived: false,
								},
							} as UpdateAdminProjectOrganizationResponse;
						}

						// If cached value is a paginated list, update the matching item in the array
						if (
							Array.isArray((cache as AdminProjectsOrganizationResponse).data)
						) {
							const list = (cache as AdminProjectsOrganizationResponse)
								.data as AdminProjectOrganization[];
							const updatedList = list.map((item) =>
								item.project_uuid === credentials.projectId
									? {
											...item,
											name: credentials.name,
											description: credentials.description,
										}
									: item
							);

							return {
								...(cache as AdminProjectsOrganizationResponse),
								data: updatedList,
							} as AdminProjectsOrganizationResponse;
						}

						// Otherwise it's a single-item response; update its fields
						const single = (cache as UpdateAdminProjectOrganizationResponse)
							.data as AdminProjectOrganization;
						return {
							...(cache as UpdateAdminProjectOrganizationResponse),
							data: {
								...single,
								name: credentials.name,
								description: credentials.description,
							},
						} as UpdateAdminProjectOrganizationResponse;
					}
				);
			});

			return { previous };
		},
		onError: (_err, _vars, context) => {
			if (!context?.previous) return;
			context.previous.forEach(([key, data]) => {
				queryClient.setQueryData(key, data);
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin-projects-organization"],
				exact: false,
			});
		},
	});
};
