import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import { cancelDeleteOrganization } from "../services/cancel-delete-organization";
import type { AdminOrganizationsListResponse } from "../types/admin-organizations";

export const useCancelDeleteOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["cancel-delete-organization"],
		mutationFn: (organizationId: string) =>
			cancelDeleteOrganization(organizationId),
		onMutate: async (organizationId) => {
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
								item.org_id === organizationId
									? { ...item, requested_at: "", deleted_at: "" }
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
