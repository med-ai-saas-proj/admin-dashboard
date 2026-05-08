import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminOrganizationsResponse } from "../types/admin-organizations";

export type AdminOrganizationDetailsParams = {
	organization_id: string;
};

export const getAdminOrganizationDetails = async (
	params: AdminOrganizationDetailsParams
) => {
	const response = await apiClient.get<AdminOrganizationsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${params.organization_id}`
	);
	return response.data;
};
