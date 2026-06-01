import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UpdateUserPermissionsInProject } from "../types/admin-project-details";
import { toApiResponse } from "@/lib/response";
import type { UserProfileResponse } from "@/features/general/types/admin";

export const updateUserPermissionsInProject = async ({
	projectId,
	userId,
	permissions,
}: {
	projectId: string;
	userId: string;
	permissions: string[];
}) => {
	const response = await apiClient.put<UserProfileResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_PROJECTS}/${projectId}/users/${userId}/permissions`,
		{ permissions }
	);

	const permissionsProject: UpdateUserPermissionsInProject = {
		permissions: response.data.results.permissions.project_permissions.flatMap(
			(perm) => perm.permissions
		),
	};

	return toApiResponse<UpdateUserPermissionsInProject>(permissionsProject);
};
