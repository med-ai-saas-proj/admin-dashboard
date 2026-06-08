import { useQuery } from "@tanstack/react-query";
import {
	getAdminProjectsOrganization,
	type AdminProjectsOrganizationParams,
} from "../services/get-admin-projects-organization";

export const useGetAdminProjectsOrganization = ({
	organizationId,
	limit,
	offset,
	q,
}: AdminProjectsOrganizationParams) => {
	return useQuery({
		queryKey: ["admin-projects-organization", organizationId, limit, offset, q],
		queryFn: () =>
			getAdminProjectsOrganization({
				organizationId,
				limit,
				offset,
				q,
			}),
		enabled: !!organizationId,
	});
};
