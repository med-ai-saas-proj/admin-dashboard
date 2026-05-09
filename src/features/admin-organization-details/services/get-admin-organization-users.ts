import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminOrganizationUsersResponse } from "../types/admin-organization-details";

export type AdminUserOrganizationParams = {
	orgId: string;
	limit?: number;
	offset?: number;
	q?: string;
};

export const getAdminOrganizationUsers = async ({
	orgId,
	offset = 0,
	limit = 10,
	q,
}: AdminUserOrganizationParams) => {
	const params: Record<string, string | number> = {
		limit,
		offset,
	};
	if (q) {
		params.q = q;
	}

	const response = await apiClient.get<AdminOrganizationUsersResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${orgId}/users`,
		{
			params: {
				limit: params.limit,
				offset: params.offset,
				q: params.q,
			},
		}
	);
	return response.data;
};
