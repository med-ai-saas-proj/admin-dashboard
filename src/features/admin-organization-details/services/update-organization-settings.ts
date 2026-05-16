import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminOrganizationSettingsResponse } from "../types/admin-organization-details";

export type UpdateAdminOrganizationSettingsCredentails = {
	organizationId: string;
	rate_limit?: number;
	spending_limit?: number;
	// extra?: Record<string, string>;
};

export const updateAdminOrganizationSettings = async (
	params: UpdateAdminOrganizationSettingsCredentails
) => {
	const response = await apiClient.patch<AdminOrganizationSettingsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${params.organizationId}/settings`,
		{
			rate_limit: params.rate_limit,
			spending_limit: params.spending_limit,
			// extra: params.extra,
		}
	);
	return response.data;
};
