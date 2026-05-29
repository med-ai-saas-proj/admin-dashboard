import { useQuery } from "@tanstack/react-query";
import {
	getAdminUserPermissions,
	type AdminUserPermissionsParams,
} from "../services/get-admin-user-permissions";

export const useGetAdminUserPermissions = (
	params: AdminUserPermissionsParams
) => {
	const query = useQuery({
		queryKey: ["admin-user-permissions", { userId: params.userId }],
		queryFn: () => getAdminUserPermissions(params),
	});

	return query;
};
