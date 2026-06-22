import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminProjectDetailsSettingsResponse } from "../types/admin-project-details";

export type UpdateAdminProjectSettingsCredentials = {
	projectId: string;
	rate_limit: number;
	spending_limit: number;
};

export const updateAdminProjectSettings = async ({
	projectId,
	rate_limit,
	spending_limit,
}: UpdateAdminProjectSettingsCredentials) => {
	const response = await apiClient.patch<AdminProjectDetailsSettingsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${projectId}/settings`,
		{
			rate_limit,
			spending_limit,
		}
	);
	return toApiResponse(response.data);
};
