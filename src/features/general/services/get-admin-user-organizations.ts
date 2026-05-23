import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UserOrganizationListResponse } from "../types/admin";

export type AdminUserOrganizationsParams = {
	userId: string;
};

export const getAdminUserOrganizations = async (
	params: AdminUserOrganizationsParams
) => {
	const response = await apiClient.get<UserOrganizationListResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN}/user-organizations`,
		{ params }
	);
	return response.data;
};
