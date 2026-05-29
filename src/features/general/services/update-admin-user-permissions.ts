import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type {
	UpdateAdminUserPermissionsRequest,
	UserProfileInfo,
	UserProfileResponse,
} from "../types/admin";
import { toApiResponse } from "@/lib/response";

export type UpdateAdminUserPermissionsParams = {
	userId: string;
	permissions: UpdateAdminUserPermissionsRequest;
};

export const updateAdminUserPermissions = async ({
	userId,
	permissions,
}: UpdateAdminUserPermissionsParams): Promise<UserProfileResponse> => {
	const response = await apiClient.put<UserProfileInfo>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/users/${userId}/permissions`,
		permissions
	);
	return toApiResponse(response.data);
};
