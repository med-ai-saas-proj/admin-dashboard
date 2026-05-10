import { useQuery } from "@tanstack/react-query";
import { getAdminProjectsPermissions } from "../services/get-admin-projects-permissions";

export const useGetAdminProjectsPermissions = () => {
	return useQuery({
		queryKey: ["admin-projects-permissions"],
		queryFn: getAdminProjectsPermissions,
	});
};
