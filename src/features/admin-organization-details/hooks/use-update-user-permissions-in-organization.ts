import { useMutation } from "@tanstack/react-query";
import { updateUserPermissionsInOrganization } from "../services/update-user-permissions-in-organization";
import type { UpdateUserPermissionsInOrganizationResponse } from "../types/admin-organization-details";

export const useUpdateUserPermissionsInOrganization = (
	organizationId: string
) => {
	return useMutation<
		UpdateUserPermissionsInOrganizationResponse,
		Error,
		{ userId: string; permissions: string[] }
	>({
		mutationKey: [
			"update-user-permissions-in-organization",
			{ organizationId },
		],
		mutationFn: (params: { userId: string; permissions: string[] }) =>
			updateUserPermissionsInOrganization({
				organizationId,
				userId: params.userId,
				permissions: params.permissions,
			}),
	});
};
