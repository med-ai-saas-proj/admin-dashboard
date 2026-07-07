import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminOrganizationCancelDeletionResponse } from "../types/admin-organizations";
import { toApiResponse } from "@/lib/response";

export const cancelDeleteOrganization = async (organizationId: string) => {
	const response =
		await apiClient.post<AdminOrganizationCancelDeletionResponse>(
			`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${organizationId}/deletion/cancel`
		);
	return toApiResponse(response.data);
};
