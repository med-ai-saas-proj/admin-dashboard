import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";

export type DeleteAdminUserPermissionsParams = {
	userId: string;
};

export const deleteAdminUserPermissions = async ({
	userId,
}: DeleteAdminUserPermissionsParams): Promise<void> => {
	await apiClient.delete(
		`${API_ROUTES.ADMIN_DASHBOARD.ADMIN}/user-permissions/${userId}`
	);
};
