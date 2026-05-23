import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminOrganizationDetailsResponse } from "../types/admin-organizations";

export type AdminOrganizationDetailsParams = {
	organization_id: string;
};

export const getAdminOrganizationDetails = async (
	params: AdminOrganizationDetailsParams
) => {
	const response = await apiClient.get<AdminOrganizationDetailsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${params.organization_id}`
	);
	return toApiResponse(response.data);
};
