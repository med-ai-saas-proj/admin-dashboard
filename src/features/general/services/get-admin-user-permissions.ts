import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UserPermissionsResponse } from "../types/admin";

export type AdminUserPermissionsParams = {
	userId: string;
};

export const getAdminUserPermissions = async (
	params: AdminUserPermissionsParams
) => {
	const response = await apiClient.get<UserPermissionsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/user-permissions/${params.userId}`
	);
	return response.data;
};
