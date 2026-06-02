import { useQuery } from "@tanstack/react-query";
import {
	getCreditsOrganization,
	type CreditsOrganizationParams,
} from "../services/get-credits-organization";

export const useGetCreditsOrganization = ({
	organizationId,
}: CreditsOrganizationParams) => {
	return useQuery({
		queryKey: ["credits-organization", organizationId],
		queryFn: () => getCreditsOrganization({ organizationId }),
		enabled: !!organizationId,
	});
};
