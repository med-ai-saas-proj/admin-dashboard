import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminApiKeyPermissionsResponse } from "../types/admin-api-keys";

export const getApiKeyPermissions = async () => {
	const response = await apiClient.get<AdminApiKeyPermissionsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_API_KEYS}/permissions`
	);
	return toApiResponse(response.data);
};
