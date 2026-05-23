import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { UpdateAdminProjectOrganizationResponse } from "../types/admin-projects";

export type UpdateAdminProjectOrganizationCredentials = {
	projectId: string;
	name: string;
	description: string | null;
};

export const updateAdminProjectOrganization = async (
	credentials: UpdateAdminProjectOrganizationCredentials
) => {
	const response = await apiClient.put<UpdateAdminProjectOrganizationResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${credentials.projectId}`,
		{
			name: credentials.name,
			description: credentials.description,
		}
	);
	return toApiResponse(response.data);
};
