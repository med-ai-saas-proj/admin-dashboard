import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { DeleteAdminProjectOrganizationResponse } from "../types/admin-projects";

export type DeleteAdminProjectOrganizationParams = {
	projectId: string;
};

export const deleteAdminProjectOrganization = async ({
	projectId,
}: DeleteAdminProjectOrganizationParams) => {
	const response =
		await apiClient.delete<DeleteAdminProjectOrganizationResponse>(
			`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${projectId}`
		);
	return response.data;
};
