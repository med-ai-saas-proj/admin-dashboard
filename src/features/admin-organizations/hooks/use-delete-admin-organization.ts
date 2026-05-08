import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import {
	deleteAdminOrganization,
	type DeleteAdminOrganizationParams,
} from "../services/delete-admin-organization";
import type { AdminOrganizationsListResponse } from "../types/admin-organizations";

export const useDeleteAdminOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["delete-admin-organization"],
		mutationFn: (params: DeleteAdminOrganizationParams) =>
			deleteAdminOrganization(params),
		onMutate: async (params) => {
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
							data: [],
							total: 0,
							offset: 0,
							limit: 10,
						};
						return {
							...prev,
							data: (prev.data ?? []).filter(
								(item) => item.org_id !== params.organization_id
							),
							total: Math.max(0, (prev.total ?? 1) - 1),
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
