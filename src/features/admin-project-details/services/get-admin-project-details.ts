import apiClient from "@/query/api-client";
import type { AdminProjectDetails } from "../types/admin-project-details";
import { API_ROUTES } from "@/config/api-routes";

export const getAdminProjectDetails = async (
	projectId: string
): Promise<AdminProjectDetails> => {
	const response = await apiClient.get<AdminProjectDetails>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${projectId}`
	);
	return response.data;
};
