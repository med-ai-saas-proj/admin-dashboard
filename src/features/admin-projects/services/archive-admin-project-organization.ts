import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { ArchiveAdminProjectOrganizationResponse } from "../types/admin-projects";

export const archiveAdminProjectOrganization = async (projectId: string) => {
	const response =
		await apiClient.post<ArchiveAdminProjectOrganizationResponse>(
			`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${projectId}/archive`
		);
	return toApiResponse(response.data);
};
