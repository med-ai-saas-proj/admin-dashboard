import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UserListResponse } from "../types/admin";

export type AdminUserParams = {
	limit: number;
	offset: number;
	q?: string;
};

export const getAdminUsers = async (params: AdminUserParams) => {
	const response = await apiClient.get<UserListResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/users`,
		{ params }
	);
	return response.data;
};
