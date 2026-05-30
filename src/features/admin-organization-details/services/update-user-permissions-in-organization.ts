import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UpdateUserPermissionsInOrganizationResponse } from "../types/admin-organization-details";
import { toApiResponse } from "@/lib/response";

export const updateUserPermissionsInOrganization = async ({
	organizationId,
	userId,
	permissions,
}: {
	organizationId: string;
	userId: string;
	permissions: string[];
}) => {
	const response =
		await apiClient.put<UpdateUserPermissionsInOrganizationResponse>(
			`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${organizationId}/users/${userId}/permissions`,
			{ permissions }
		);

	return toApiResponse(response.data);
};
