import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminApiKeysResponse } from "../types/admin-api-keys";

export type GetAdminApiKeysProjectParams = {
	projectId: string;
};

export const getAdminApiKeysProject = async ({
	projectId,
}: GetAdminApiKeysProjectParams) => {
	const response = await apiClient.get<AdminApiKeysResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_API_KEYS}`,
		{
			params: {
				project_id: projectId,
			},
		}
	);
	return response.data;
};
