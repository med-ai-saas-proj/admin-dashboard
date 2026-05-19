import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";

export type DeleteAdminApiKeyCredentials = {
	apiKeyId: string;
};

export const deleteAdminApiKey = async ({
	apiKeyId,
}: DeleteAdminApiKeyCredentials) => {
	const response = await apiClient.delete<null>(
		`${API_ROUTES.MANAGEMENT.ADMIN_API_KEYS}/${apiKeyId}`
	);
	return response.data;
};
