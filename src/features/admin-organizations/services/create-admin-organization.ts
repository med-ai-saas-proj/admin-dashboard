import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";
import type { AdminOrganizationsResponse } from "../types/admin-organizations";

export type CreateAdminOrganizationsCredentials = {
	name: string;
	alias: string | null;
	owner_id: string | null;
};

export const createAdminOrganization = async (
	credentials: CreateAdminOrganizationsCredentials
) => {
	const response = await apiClient.post<AdminOrganizationsResponse>(
		API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION,
		credentials
	);
	return toApiResponse(response.data);
};
