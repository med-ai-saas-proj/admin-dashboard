import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminProjectsOrganizationResponse } from "../types/admin-projects";

export type AdminProjectsOrganizationParams = {
	organizationId: string;
	limit?: number;
	offset?: number;
	q?: string;
};

export const getAdminProjectsOrganization = async ({
	organizationId,
	limit = 10,
	offset = 0,
	q,
}: AdminProjectsOrganizationParams) => {
	const response = await apiClient.get<AdminProjectsOrganizationResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}`,
		{
			params: {
				org_id: organizationId,
				limit,
				offset,
				q,
			},
		}
	);
	return response.data;
};
