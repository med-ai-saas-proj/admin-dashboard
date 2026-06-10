import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { CreateAdminProjectOrganizationResponse } from "../types/admin-projects";

export type CreateAdminProjectOrganizationCredentials = {
	organizationId: string;
	name: string;
	description: string | null;
};

export const createAdminProjectOrganization = async ({
	organizationId,
	name,
	description,
}: CreateAdminProjectOrganizationCredentials) => {
	const response = await apiClient.post<CreateAdminProjectOrganizationResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}`,
		{
			name,
			description,
		},
		{
			params: {
				org_id: organizationId,
			},
		}
	);
	return toApiResponse(response.data);
};
