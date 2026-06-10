import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	updateAdminUserPermissions,
	type UpdateAdminUserPermissionsParams,
} from "../services/update-admin-user-permissions";
import type {
	UserPermissionsResponse,
	UserProfileResponse,
} from "../types/admin";

export const useUpdateAdminUserPermissions = () => {
	const queryClient = useQueryClient();

	return useMutation({
		onMutate: async ({ userId, permissions }) => {
			const permissionsQueryKey = ["admin-user-permissions", { userId }];
			const profileQueryKey = ["admin-user-profile", { userId }];

			await queryClient.cancelQueries({ queryKey: permissionsQueryKey });
			await queryClient.cancelQueries({ queryKey: profileQueryKey });

			const previousPermissions =
				queryClient.getQueryData<UserPermissionsResponse>(permissionsQueryKey);
			const previousProfile =
				queryClient.getQueryData<UserProfileResponse>(profileQueryKey);

			const optimisticPermissions = {
				organization_permissions: permissions.organization_permissions,
				effective_organization_permissions:
					permissions.organization_permissions,
				project_permissions: permissions.project_permissions.map(
					(projectPermission) => ({
						project_uuid: projectPermission.project_uuid,
						permissions: projectPermission.permissions,
						effective_permissions: projectPermission.permissions,
					})
				),
			};

			if (previousPermissions?.results) {
				queryClient.setQueryData<UserPermissionsResponse>(permissionsQueryKey, {
					success: true,
					results: {
						...previousPermissions.results,
						organization_permissions:
							optimisticPermissions.organization_permissions,
						effective_organization_permissions:
							optimisticPermissions.effective_organization_permissions,
						project_permissions: optimisticPermissions.project_permissions,
					},
				});
			}

			if (previousProfile?.results) {
				queryClient.setQueryData<UserProfileResponse>(profileQueryKey, {
					success: true,
					results: {
						...previousProfile.results,
						permissions: {
							...previousProfile.results.permissions,
							...optimisticPermissions,
						},
					},
				});
			}

			return {
				previousPermissions,
				previousProfile,
				permissionsQueryKey,
				profileQueryKey,
			};
		},
		onError: (_error, _variables, context) => {
			if (!context) {
				return;
			}

			queryClient.setQueryData(
				context.permissionsQueryKey,
				context.previousPermissions
			);
			queryClient.setQueryData(
				context.profileQueryKey,
				context.previousProfile
			);
		},
		onSettled: async (_data, _error, { userId }) => {
			await queryClient.invalidateQueries({
				queryKey: ["admin-user-permissions", { userId }],
			});
			await queryClient.invalidateQueries({
				queryKey: ["admin-user-profile", { userId }],
			});
		},
		mutationFn: (params: UpdateAdminUserPermissionsParams) =>
			updateAdminUserPermissions(params),
	});
};
