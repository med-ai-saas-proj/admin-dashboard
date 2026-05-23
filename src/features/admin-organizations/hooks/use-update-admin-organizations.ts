import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import {
	updateAdminOrganization,
	type UpdateAdminOrganizationCredentials,
} from "../services/update-admin-organization";
import type { AdminOrganizationsListResponse } from "../types/admin-organizations";

export const useUpdateAdminOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["update-admin-organization"],
		mutationFn: (credentials: UpdateAdminOrganizationCredentials) =>
			updateAdminOrganization(credentials),
		onMutate: async (updated) => {
			await queryClient.cancelQueries({
				queryKey: ["admin-organizations"],
			});

			const previous = queryClient.getQueriesData({
				queryKey: ["admin-organizations"],
			}) as Array<[QueryKey, AdminOrganizationsListResponse | undefined]>;

			previous.forEach(([key]) => {
				queryClient.setQueryData<AdminOrganizationsListResponse | undefined>(
					key,
					(old) => {
						const prev = old ?? {
							success: true,
							results: [],
							total: 0,
							offset: 0,
							limit: 10,
						};
						return {
							...prev,
							results: (prev.results ?? []).map((item) =>
								item.org_id === updated.organization_id
									? { ...item, name: updated.name }
									: item
							),
						};
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
				queryKey: ["admin-organizations"],
			});
			queryClient.invalidateQueries({
				queryKey: ["admin-organization-details"],
			});
		},
	});
};
