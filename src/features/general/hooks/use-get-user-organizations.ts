import { useQuery } from "@tanstack/react-query";
import {
	getAdminUserOrganizations,
	type AdminUserOrganizationsParams,
} from "../services/get-admin-user-organizations";

export const useGetAdminUserOrganizations = (
	params: AdminUserOrganizationsParams
) => {
	const query = useQuery({
		queryKey: ["admin-user-organizations", params],
		queryFn: () => getAdminUserOrganizations(params),
	});

	return query;
};
