import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminMe } from "../types/admin";

export const getAdminMe = async () => {
	const response = await apiClient.get<AdminMe>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/me`
	);
	return response.data;
};
