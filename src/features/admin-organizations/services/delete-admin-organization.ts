import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminOrganizationDeleteResponse } from "../types/admin-organizations";

export type DeleteAdminOrganizationParams = {
	organization_id: string;
};

export const deleteAdminOrganization = async (
	params: DeleteAdminOrganizationParams
) => {
	const response = await apiClient.delete<AdminOrganizationDeleteResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${params.organization_id}`
	);
	return toApiResponse(response.data);
};
