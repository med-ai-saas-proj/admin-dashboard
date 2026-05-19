import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UserPermissions } from "../types/admin";

export type UpdateAdminUserPermissionsParams = {
	userId: string;
	permissions: UserPermissions;
};

export const updateAdminUserPermissions = async ({
	userId,
	permissions,
}: UpdateAdminUserPermissionsParams): Promise<UserPermissions> => {
	const response = await apiClient.put<UserPermissions>(
		`${API_ROUTES.ADMIN_DASHBOARD.ADMIN}/user-permissions/${userId}`,
		permissions
	);
	return response.data;
};
