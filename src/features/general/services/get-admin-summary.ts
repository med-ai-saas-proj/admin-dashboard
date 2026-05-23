import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AdminSummary } from "../types/admin";

export const getAdminSummary = async () => {
	const response = await apiClient.get<AdminSummary>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/dashboard/summary`
	);
	return response.data;
};
