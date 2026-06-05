import { useQuery } from "@tanstack/react-query";
import {
	getAdminUserProfile,
	type AdminUserProfileParams,
} from "../services/get-admin-user-profile";

export const useGetAdminUserProfile = ({
	params,
	enabled = true,
}: {
	params: AdminUserProfileParams;
	enabled?: boolean;
}) => {
	const query = useQuery({
		queryKey: ["admin-user-profile", params],
		queryFn: () => getAdminUserProfile(params),
		enabled,
	});

	return query;
};
