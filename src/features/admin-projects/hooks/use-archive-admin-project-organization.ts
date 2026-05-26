import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveAdminProjectOrganization } from "../services/archive-admin-project-organization";

export const useArchiveAdminProjectOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["archive-admin-project-organization"],
		mutationFn: (projectId: string) =>
			archiveAdminProjectOrganization(projectId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin-projects-organization"],
				exact: false,
			});
		},
	});
};
