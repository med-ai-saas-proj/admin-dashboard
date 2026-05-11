import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import {
	deleteAdminProjectOrganization,
	type DeleteAdminProjectOrganizationParams,
} from "../services/delete-admin-project-organization";
import type { AdminProjectsOrganizationResponse } from "../types/admin-projects";

export const useDeleteAdminProjectOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["delete-admin-project-organization"],
		mutationFn: (params: DeleteAdminProjectOrganizationParams) =>
			deleteAdminProjectOrganization(params),
		onMutate: async (params) => {
			await queryClient.cancelQueries({
				queryKey: ["admin-projects-organization"],
				exact: false,
			});

			const previousData = queryClient.getQueriesData({
				queryKey: ["admin-projects-organization"],
			}) as Array<[QueryKey, AdminProjectsOrganizationResponse | undefined]>;

			previousData.forEach(([key]) => {
				queryClient.setQueryData<AdminProjectsOrganizationResponse | undefined>(
					key,
					(old) => {
						const prev = old ?? {
							success: true,
							data: [],
							total: 0,
							offset: 0,
							limit: 10,
						};
						return {
							...prev,
							data: prev.data.map((item) => {
								if (item.project_uuid === params.projectId) {
									item.archived = true;
								}
								return item;
							}),
							total: prev.total,
						};
					}
				);
			});

			return { previousData };
		},
	});
};
