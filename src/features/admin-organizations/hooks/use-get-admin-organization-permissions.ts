import { useQuery } from "@tanstack/react-query";
import { getAdminOrganizationPermissions } from "../services/get-admin-organization-permissions";

export const useGetAdminOrganizationPermissions = () => {
	return useQuery({
		queryKey: ["admin-organization-permissions"],
		queryFn: getAdminOrganizationPermissions,
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
	});
};
