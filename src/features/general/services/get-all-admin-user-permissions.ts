import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UserPermissions, UserPermissionsResponse } from "../types/admin";
import { toApiResponse } from "@/lib/response";

export const getAllAdminUserPermissions = async ({
	userId,
}: {
	userId: string;
}): Promise<UserPermissionsResponse> => {
	const response = await apiClient.get<UserPermissionsResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/users/${userId}/permissions`
	);
	return toApiResponse<UserPermissions>(response.data);
};
