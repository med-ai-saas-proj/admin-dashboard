import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminApiKeyResponse } from "../types/admin-api-keys";

export type UpdateAdminApiKeyCredentials = {
	apiKeyId: string;
	name: string;
	description: string;
	permissions: string[];
	disabled: boolean;
};

export const updateAdminApiKey = async ({
	apiKeyId,
	name,
	description,
	permissions,
	disabled,
}: UpdateAdminApiKeyCredentials) => {
	const response = await apiClient.put<AdminApiKeyResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_API_KEYS}/${apiKeyId}`,
		{
			name,
			description,
			permissions,
			disabled,
		}
	);
	return toApiResponse(response.data);
};
