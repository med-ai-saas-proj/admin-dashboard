import { useQuery } from "@tanstack/react-query";
import {
	getAdminOrganizations,
	type AdminOrganizationParams,
} from "../services/get-admin-organizations";

export const useGetAdminOrganizations = (params?: AdminOrganizationParams) => {
	return useQuery({
		queryKey: ["admin-organizations", params],
		queryFn: () => getAdminOrganizations(params),
	});
};
