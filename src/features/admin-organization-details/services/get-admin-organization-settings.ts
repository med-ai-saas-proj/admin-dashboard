import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminOrganizationSettingsResponse } from "../types/admin-organization-details";

export type AdminOrganizationSettingsParams = {
	organizationId: string;
};

export const getAdminOrganizationSettings = async (
	params: AdminOrganizationSettingsParams
) => {
	const response = await apiClient.get<AdminOrganizationSettingsResponse>(
		`${API_ROUTES.ADMIN_ORGANIZATION_DETAILS.SETTINGS}/${params.organizationId}`
	);
	return response.data;
};
