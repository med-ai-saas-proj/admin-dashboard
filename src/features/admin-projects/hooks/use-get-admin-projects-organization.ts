import { useQuery } from "@tanstack/react-query";
import {
	getAdminProjectsOrganization,
	type AdminProjectsOrganizationParams,
} from "../services/get-admin-projects-organization";

export const useGetAdminProjectsOrganization = ({
	organizationId,
	limit,
	offset,
}: AdminProjectsOrganizationParams) => {
	return useQuery({
		queryKey: ["admin-projects-organization", organizationId, limit, offset],
		queryFn: () =>
			getAdminProjectsOrganization({
				organizationId,
				limit,
				offset,
			}),
		enabled: !!organizationId,
	});
};
