import { useQuery } from "@tanstack/react-query";
import {
	getAdminUserProfile,
	type AdminUserProfileParams,
} from "../services/get-admin-user-profile";

export const useGetAdminUserProfile = (params: AdminUserProfileParams) => {
	const query = useQuery({
		queryKey: ["admin-user-profile", params],
		queryFn: () => getAdminUserProfile(params),
	});

	return query;
};
