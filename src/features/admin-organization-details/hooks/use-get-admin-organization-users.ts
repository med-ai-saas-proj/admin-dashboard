import { useQuery } from "@tanstack/react-query";
import {
	getAdminOrganizationUsers,
	type AdminUserOrganizationParams,
} from "../services/get-admin-organization-users";

export const useGetAdminOrganizationUsers = (
	params: AdminUserOrganizationParams
) => {
	return useQuery({
		queryKey: [
			"admin-organization-users",
			params.orgId,
			params.limit,
			params.offset,
			params.q,
		],
		queryFn: () => getAdminOrganizationUsers(params),
		enabled: !!params.orgId,
	});
};
