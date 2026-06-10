import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminOrganizationSettingsResponse } from "../types/admin-organization-details";

export type AdminOrganizationSettingsParams = {
	organizationId: string;
};

export const getAdminOrganizationSettings = async (
	params: AdminOrganizationSettingsParams
) => {
	const response = await apiClient.get<AdminOrganizationSettingsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${params.organizationId}/settings`
	);
	return toApiResponse(response.data);
};
