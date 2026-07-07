import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UserProfileInfo } from "@/features/general/types/admin";

export const addAdminOrganizationUser = async ({
	organizationId,
	userId,
	permissions,
}: {
	organizationId: string;
	userId: string;
	permissions: string[];
}): Promise<UserProfileInfo> => {
	const response = await apiClient.post<UserProfileInfo>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/organizations/${organizationId}/users`,
		{
			user_id: userId,
			permissions,
		}
	);
	return response.data;
};
