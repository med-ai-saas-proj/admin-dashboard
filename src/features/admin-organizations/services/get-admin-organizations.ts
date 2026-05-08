import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminOrganizationsListResponse } from "../types/admin-organizations";

export type AdminOrganizationParams = {
	limit?: number;
	offset?: number;
	q?: string;
};

export const getAdminOrganizations = async (
	params?: AdminOrganizationParams
) => {
	const response = await apiClient.get<AdminOrganizationsListResponse>(
		API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION,
		{
			params,
		}
	);
	return response.data;
};
