import { useMutation } from "@tanstack/react-query";
import { updateUserPermissionsInProject } from "../services/update-user-permissions-in-project";
import type { UpdateUserPermissionsInProjectResponse } from "../types/admin-project-details";

export const useUpdateUserPermissionsInProject = (projectId: string) => {
	return useMutation<
		UpdateUserPermissionsInProjectResponse,
		Error,
		{ userId: string; permissions: string[] }
	>({
		mutationKey: ["update-user-permissions-in-project", { projectId }],
		mutationFn: (params: { userId: string; permissions: string[] }) =>
			updateUserPermissionsInProject({
				projectId,
				userId: params.userId,
				permissions: params.permissions,
			}),
	});
};
