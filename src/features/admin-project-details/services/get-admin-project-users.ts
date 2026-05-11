import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminProjectDetailsUsersResponse } from "../types/admin-project-details";

export type GetAdminProjectUsersParams = {
	projectId: string;
	limit?: number;
	offset?: number;
	q?: string;
};

export const getAdminProjectUsers = async ({
	projectId,
	limit = 10,
	offset = 0,
	q = "",
}: GetAdminProjectUsersParams) => {
	const response = await apiClient.get<AdminProjectDetailsUsersResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${projectId}/users`,
		{
			params: {
				limit,
				offset,
				q,
			},
		}
	);
	return response.data;
};
