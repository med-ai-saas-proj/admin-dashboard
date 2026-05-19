import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminOrganizationPermissionsResponse } from "../types/admin-organizations";

export const getAdminOrganizationPermissions = async () => {
	const response = await apiClient.get<AdminOrganizationPermissionsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/permissions`
	);
	return response.data;
};
