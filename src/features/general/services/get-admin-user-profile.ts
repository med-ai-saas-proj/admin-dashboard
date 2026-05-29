import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { UserProfileResponse } from "../types/admin";

export type AdminUserProfileParams = {
	userId: string;
};

export const getAdminUserProfile = async (params: AdminUserProfileParams) => {
	const response = await apiClient.get<UserProfileResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/users/${params.userId}/profile`
	);
	return toApiResponse(response.data);
};
