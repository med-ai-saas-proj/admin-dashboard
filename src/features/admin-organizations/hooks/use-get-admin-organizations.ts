import { useQuery } from "@tanstack/react-query";
import {
	getAdminOrganizations,
	type AdminOrganizationParams,
} from "../services/get-admin-organizations";

export const useGetAdminOrganizations = (params?: AdminOrganizationParams) => {
	return useQuery({
		queryKey: ["admin-organizations", params],
		queryFn: () => getAdminOrganizations(params),
		staleTime: 5 * 60 * 1000, // 5 min — org list doesn't change often
		gcTime: 10 * 60 * 1000, // keep in cache for 10 min after unmount
		// Dialogs only use refetch() after mutations — don't re-fetch on remount
		refetchOnMount: false,
	});
};
