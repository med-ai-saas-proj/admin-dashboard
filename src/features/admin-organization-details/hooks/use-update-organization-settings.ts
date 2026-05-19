import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import {
	type UpdateAdminOrganizationSettingsCredentails,
	updateAdminOrganizationSettings,
} from "../services/update-organization-settings";
import type { AdminOrganizationSettingsResponse } from "../types/admin-organization-details";

export const useUpdateOrganizationSettings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["update-admin-organization-settings"],
		mutationFn: (params: UpdateAdminOrganizationSettingsCredentails) =>
			updateAdminOrganizationSettings(params),
		onMutate: async (params) => {
			await queryClient.cancelQueries({
				queryKey: ["admin-organization-settings", params.organizationId],
			});

			const previous = queryClient.getQueriesData({
				queryKey: ["admin-organization-settings", params.organizationId],
			}) as Array<[QueryKey, AdminOrganizationSettingsResponse | undefined]>;

			queryClient.setQueryData<AdminOrganizationSettingsResponse | undefined>(
				["admin-organization-settings", params.organizationId],
				(old) => {
					const prev = old ?? {
						success: true,
						data: {
							rate_limit: 0,
							spending_limit: 0,
							// extra: {},
						},
					};
					return {
						...prev,
						data: {
							rate_limit: params.rate_limit ?? prev.data.rate_limit,
							spending_limit: params.spending_limit ?? prev.data.spending_limit,
							// extra: params.extra ?? prev.data.extra,
						},
					};
				}
			);

			return { previous };
		},
		onError: (_err, _vars, context) => {
			// Optionally, handle errors here and rollback optimistic updates if needed
			if (!context?.previous) return;
			context.previous.forEach(([key, data]) => {
				queryClient.setQueryData(key, data);
			});
		},
		onSuccess: (data, params) => {
			// Optionally, invalidate queries or update the cache here
			queryClient.setQueryData(
				["admin-organization-settings", params.organizationId],
				data
			);
		},
	});
};
