import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import {
	updateAdminProjectSettings,
	type UpdateAdminProjectSettingsCredentials,
} from "../services/update-admin-project-settings";
import type { AdminProjectDetailsSettingsResponse } from "../types/admin-project-details";

export const useUpdateAdminProjectSettings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["update-admin-project-settings"],
		mutationFn: (credentials: UpdateAdminProjectSettingsCredentials) =>
			updateAdminProjectSettings(credentials),
		onMutate: async (credentials) => {
			await queryClient.cancelQueries({
				queryKey: ["admin-project-settings"],
				exact: false,
			});

			const previous = queryClient.getQueriesData({
				queryKey: ["admin-project-settings"],
				exact: false,
			}) as Array<[QueryKey, AdminProjectDetailsSettingsResponse | undefined]>;

			previous.forEach(([key]) => {
				queryClient.setQueryData<
					AdminProjectDetailsSettingsResponse | undefined
				>(key, (old) => {
					if (!old) {
						return {
							success: true,
							results: {
								rate_limit: credentials.rate_limit ?? 0,
								spending_limit: credentials.spending_limit ?? 0,
							},
						};
					}

					return {
						...old,
						results: {
							...old.results,
							rate_limit: credentials.rate_limit ?? old.results.rate_limit,
							spending_limit:
								credentials.spending_limit ?? old.results.spending_limit,
						},
					};
				});
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
				queryKey: ["admin-project-details"],
				exact: false,
			});
		},
	});
};
