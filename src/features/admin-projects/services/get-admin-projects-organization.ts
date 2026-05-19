import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminProjectsOrganizationResponse } from "../types/admin-projects";

export type AdminProjectsOrganizationParams = {
	organizationId: string;
	limit?: number;
	offset?: number;
};

export const getAdminProjectsOrganization = async ({
	organizationId,
	limit = 1000,
	offset = 0,
}: AdminProjectsOrganizationParams) => {
	const response = await apiClient.get<AdminProjectsOrganizationResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}`,
		{
			params: {
				org_id: organizationId,
				limit,
				offset,
			},
		}
	);
	return response.data;
};
