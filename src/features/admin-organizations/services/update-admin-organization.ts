import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminOrganizationsResponse } from "../types/admin-organizations";

export type UpdateAdminOrganizationCredentials = {
	organization_id: string;
	name: string;
};

export const updateAdminOrganization = async (
	credentials: UpdateAdminOrganizationCredentials
) => {
	const response = await apiClient.put<AdminOrganizationsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${credentials.organization_id}`,
		{ name: credentials.name }
	);
	return response.data;
};
