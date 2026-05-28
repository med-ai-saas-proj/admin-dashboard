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
		`${API_ROUTES.MANAGEMENT.ADMIN}/users/${userId}/permissions`,
		permissions
	);
	return response.data;
};
