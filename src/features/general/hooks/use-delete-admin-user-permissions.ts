import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	deleteAdminUserPermissions,
	type DeleteAdminUserPermissionsParams,
} from "../services/delete-admin-user-permissions";
import type {
	UserPermissionsResponse,
	UserProfileResponse,
} from "../types/admin";

export const useDeleteAdminUserPermissions = () => {
	const queryClient = useQueryClient();

	return useMutation({
		onMutate: async ({ userId }) => {
			const permissionsQueryKey = ["admin-user-permissions", { userId }];
			const profileQueryKey = ["admin-user-profile", { userId }];

			await queryClient.cancelQueries({ queryKey: permissionsQueryKey });
			await queryClient.cancelQueries({ queryKey: profileQueryKey });

			const previousPermissions =
				queryClient.getQueryData<UserPermissionsResponse>(permissionsQueryKey);
			const previousProfile =
				queryClient.getQueryData<UserProfileResponse>(profileQueryKey);

			if (previousPermissions?.results) {
				queryClient.setQueryData<UserPermissionsResponse>(permissionsQueryKey, {
					success: true,
					results: {
						...previousPermissions.results,
						organization_permissions: [],
						effective_organization_permissions: [],
						project_permissions: [],
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
							organization_permissions: [],
							effective_organization_permissions: [],
							project_permissions: [],
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
		mutationFn: (params: DeleteAdminUserPermissionsParams) =>
			deleteAdminUserPermissions(params),
	});
};
