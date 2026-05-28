import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { UserProfileResponse } from "../types/admin";

export type AdminUserProfileCredentials = {
	userId: string;
	organizationPermissions: string[];
	projectPermissions: {
		projectId: string;
		permissions: string[];
	};
};

export const getAdminUserProfile = async (
	params: AdminUserProfileCredentials
) => {
	const response = await apiClient.get<UserProfileResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/users/${params.userId}/profile`
	);
	return toApiResponse(response.data);
};
