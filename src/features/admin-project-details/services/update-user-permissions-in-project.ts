import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UpdateUserPermissionsInProjectResponse } from "../types/admin-project-details";
import { toApiResponse } from "@/lib/response";

export const updateUserPermissionsInProject = async ({
	projectId,
	userId,
	permissions,
}: {
	projectId: string;
	userId: string;
	permissions: string[];
}) => {
	const response = await apiClient.put<UpdateUserPermissionsInProjectResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${projectId}/users/${userId}/permissions`,
		{ permissions }
	);

	return toApiResponse(response.data);
};
