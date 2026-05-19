import { useQuery } from "@tanstack/react-query";
import {
	getAdminUsers,
	type AdminUserParams,
} from "../services/get-admin-users";

export const useGetAdminUsers = (params: AdminUserParams) => {
	const query = useQuery({
		queryKey: ["admin-users", params],
		queryFn: () => getAdminUsers(params),
	});

	return query;
};
