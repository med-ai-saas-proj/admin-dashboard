import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminApiKeyResponse } from "../types/admin-api-keys";

export type CreateAdminApiKeyCredentials = {
	name: string;
	description: string;
	permissions: string[];
	projectId: string;
};

export const createAdminApiKey = async ({
	name,
	description,
	permissions,
	projectId,
}: CreateAdminApiKeyCredentials) => {
	const response = await apiClient.post<AdminApiKeyResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_API_KEYS}`,
		{
			name,
			description,
			permissions,
		},
		{
			params: {
				project_id: projectId,
			},
		}
	);
	return toApiResponse(response.data);
};
