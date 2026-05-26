import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unarchiveAdminProjectOrganization } from "../services/unarchive-admin-project-organization";

export const useUnarchiveAdminProjectOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["unarchive-admin-project-organization"],
		mutationFn: (projectId: string) =>
			unarchiveAdminProjectOrganization(projectId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin-projects-organization"],
				exact: false,
			});
		},
	});
};
