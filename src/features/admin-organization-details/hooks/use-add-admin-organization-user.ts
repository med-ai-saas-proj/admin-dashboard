import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAdminOrganizationUser } from "../services/add-admin-organization-user";

export const useAddAdminOrganizationUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["add-admin-organization-user"],
		mutationFn: ({
			organizationId,
			userId,
			permissions,
		}: {
			organizationId: string;
			userId: string;
			permissions: string[];
		}) => addAdminOrganizationUser({ organizationId, userId, permissions }),
		onMutate: async (_variables) => {
			// Cancel any outgoing refetches for organization users queries
			await queryClient.cancelQueries({
				queryKey: ["admin-organization-users"],
			});
		},
		onError: (_error, _variables, _context) => {
			// Error handling is done globally via MutationCache onError
		},
		onSettled: () => {
			// Invalidate the organization users queries to refetch fresh data
			queryClient.invalidateQueries({
				queryKey: ["admin-organization-users"],
			});
		},
	});
};
