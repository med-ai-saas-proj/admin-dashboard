import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminProjectDetailsSettingsResponse } from "../types/admin-project-details";

export type GetAdminProjectSettingsParams = {
	projectId: string;
};

export const getAdminProjectSettings = async ({
	projectId,
}: GetAdminProjectSettingsParams) => {
	const response = await apiClient.get<AdminProjectDetailsSettingsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${projectId}/settings`
	);
	return response.data.data;
};
