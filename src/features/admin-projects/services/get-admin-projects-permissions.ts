import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminProjectsPermissionsResponse } from "../types/admin-projects";

export const getAdminProjectsPermissions = async () => {
	const response = await apiClient.get<AdminProjectsPermissionsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/permissions`
	);
	return toApiResponse(response.data);
};
