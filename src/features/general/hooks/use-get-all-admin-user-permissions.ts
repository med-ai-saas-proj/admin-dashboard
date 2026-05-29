import { useQuery } from "@tanstack/react-query";
import { getAllAdminUserPermissions } from "../services/get-all-admin-user-permissions";
import type { UserPermissionsResponse } from "../types/admin";

export const useGetAllAdminUserPermissions = ({
	userId,
}: {
	userId: string;
}) => {
	return useQuery<UserPermissionsResponse>({
		queryKey: ["admin-user-permissions", { userId }],
		queryFn: () => getAllAdminUserPermissions({ userId }),
		enabled: !!userId,
	});
};
