import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { UnArchiveAdminProjectOrganizationResponse } from "../types/admin-projects";

export const unarchiveAdminProjectOrganization = async (projectId: string) => {
	const response =
		await apiClient.post<UnArchiveAdminProjectOrganizationResponse>(
			`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${projectId}/unarchive`
		);
	return toApiResponse(response.data);
};
