import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
	getAdminOrganizationDetails,
	type AdminOrganizationDetailsParams,
} from "../services/get-admin-organization-details";
import type { AdminOrganizationsResponse } from "../types/admin-organizations";

export const useGetAdminOrganizationDetails = (
	params: AdminOrganizationDetailsParams,
	options?: Omit<UseQueryOptions<AdminOrganizationsResponse>, "queryKey">
) => {
	return useQuery({
		queryKey: ["admin-organization-details", params],
		queryFn: () => getAdminOrganizationDetails(params),
		...options,
	});
};
