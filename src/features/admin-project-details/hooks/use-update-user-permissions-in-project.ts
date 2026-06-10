import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserPermissionsInProject } from "../services/update-user-permissions-in-project";
import type { UpdateUserPermissionsInProjectResponse } from "../types/admin-project-details";
import type {
	UserPermissionsResponse,
	UserProfileResponse,
} from "@/features/general/types/admin";

type UpdateUserPermissionsContext = {
	previousPermissions?: UserPermissionsResponse;
	previousProfile?: UserProfileResponse;
	permissionsQueryKey: readonly [string, { userId: string }];
	profileQueryKey: readonly [string, { userId: string }];
};

export const useUpdateUserPermissionsInProject = (projectId: string) => {
	const queryClient = useQueryClient();
	const permissionsQueryKey = (userId: string) =>
		["admin-user-permissions", { userId }] as const;
	const profileQueryKey = (userId: string) =>
		["admin-user-profile", { userId }] as const;

	return useMutation<
		UpdateUserPermissionsInProjectResponse,
		Error,
		{ userId: string; permissions: string[] },
		UpdateUserPermissionsContext
	>({
		mutationKey: ["update-user-permissions-in-project", { projectId }],
		onMutate: async ({ userId, permissions }) => {
			const currentPermissionsQueryKey = permissionsQueryKey(userId);
			const currentProfileQueryKey = profileQueryKey(userId);

			await queryClient.cancelQueries({
				queryKey: currentPermissionsQueryKey,
			});
			await queryClient.cancelQueries({
				queryKey: currentProfileQueryKey,
			});

			const previousPermissions =
				queryClient.getQueryData<UserPermissionsResponse>(
					currentPermissionsQueryKey
				);
			const previousProfile = queryClient.getQueryData<UserProfileResponse>(
				currentProfileQueryKey
			);

			if (previousPermissions?.results) {
				queryClient.setQueryData<UserPermissionsResponse>(
					currentPermissionsQueryKey,
					{
						success: true,
						results: {
							...previousPermissions.results,
							project_permissions:
								previousPermissions.results.project_permissions.map(
									(projectPermission) =>
										projectPermission.project_uuid === projectId
											? {
													...projectPermission,
													permissions,
													effective_permissions: permissions,
												}
											: projectPermission
								),
						},
					}
				);
			}

			if (previousProfile?.results) {
				queryClient.setQueryData<UserProfileResponse>(currentProfileQueryKey, {
					success: true,
					results: {
						...previousProfile.results,
						permissions: {
							...previousProfile.results.permissions,
							project_permissions:
								previousProfile.results.permissions.project_permissions.map(
									(projectPermission) =>
										projectPermission.project_uuid === projectId
											? {
													...projectPermission,
													permissions,
													effective_permissions: permissions,
												}
											: projectPermission
								),
						},
					},
				});
			}

			return {
				previousPermissions,
				previousProfile,
				permissionsQueryKey: currentPermissionsQueryKey,
				profileQueryKey: currentProfileQueryKey,
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
		onSettled: (_data, _error, { userId }) => {
			void Promise.allSettled([
				queryClient.invalidateQueries({
					queryKey: permissionsQueryKey(userId),
				}),
				queryClient.invalidateQueries({
					queryKey: profileQueryKey(userId),
				}),
			]);
		},
		mutationFn: (params: { userId: string; permissions: string[] }) =>
			updateUserPermissionsInProject({
				projectId,
				userId: params.userId,
				permissions: params.permissions,
			}),
	});
};
