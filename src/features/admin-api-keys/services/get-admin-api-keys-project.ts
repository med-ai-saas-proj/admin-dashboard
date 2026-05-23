import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminApiKeysResponse } from "../types/admin-api-keys";

export type GetAdminApiKeysProjectParams = {
	projectId: string;
	limit?: number;
	offset?: number;
	q?: string;
};

export const getAdminApiKeysProject = async ({
	projectId,
	limit,
	offset,
	q,
}: GetAdminApiKeysProjectParams) => {
	const response = await apiClient.get<AdminApiKeysResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_API_KEYS}`,
		{
			params: {
				project_id: projectId,
				limit,
				offset,
				q,
			},
		}
	);
	return toApiResponse(response.data);
};
