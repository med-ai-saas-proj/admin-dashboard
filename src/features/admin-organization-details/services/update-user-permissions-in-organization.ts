import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { UserPermissionsInOrganization } from "../types/admin-organization-details";
import { toApiResponse } from "@/lib/response";
import type { UserProfileResponse } from "@/features/general/types/admin";

export const updateUserPermissionsInOrganization = async ({
	organizationId,
	userId,
	permissions,
}: {
	organizationId: string;
	userId: string;
	permissions: string[];
}) => {
	const response = await apiClient.put<UserProfileResponse>(
		`${API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION}/${organizationId}/users/${userId}/permissions`,
		{ permissions }
	);

	const permissionsOrganization: UserPermissionsInOrganization = {
		permissions: response.data.results.permissions.organization_permissions,
	};

	return toApiResponse(permissionsOrganization);
};
