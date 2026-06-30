import { useQuery } from "@tanstack/react-query";
import {
	getAdminProjectUsers,
	type GetAdminProjectUsersParams,
} from "../services/get-admin-project-users";

export const useGetAdminProjectUsers = ({
	projectId,
	limit,
	offset,
	q,
}: GetAdminProjectUsersParams) => {
	return useQuery({
		queryKey: ["admin-project-users", projectId, limit, offset, q],
		queryFn: () => getAdminProjectUsers({ projectId, limit, offset, q }),
		enabled: !!projectId,
	});
};
