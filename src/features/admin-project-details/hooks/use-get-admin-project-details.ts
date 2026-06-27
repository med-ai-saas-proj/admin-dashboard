import { useQuery } from "@tanstack/react-query";
import { getAdminProjectDetails } from "../services/get-admin-project-details";

export const useGetAdminProjectDetails = (projectId: string) => {
	return useQuery({
		queryKey: ["admin-project-details", projectId],
		queryFn: () => getAdminProjectDetails(projectId),
		enabled: !!projectId,
	});
};
