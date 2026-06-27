import { useQueryClient } from "@tanstack/react-query";

/**
 * Invalidates all admin-organizations queries so they refetch.
 * Use this in dialogs after create/update/delete mutations.
 */
export const useRefetchAdminOrganizations = () => {
	const queryClient = useQueryClient();
	return () =>
		queryClient.invalidateQueries({
			queryKey: ["admin-organizations"],
		});
};
