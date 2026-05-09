import { useQuery } from "@tanstack/react-query";
import {
	getAdminOrganizationSettings,
	type AdminOrganizationSettingsParams,
} from "../services/get-admin-organization-settings";

export const useGetAdminOrganizationSettings = (
	params: AdminOrganizationSettingsParams
) => {
	return useQuery({
		queryKey: ["admin-organization-settings", params.organizationId],
		queryFn: () => getAdminOrganizationSettings(params),
	});
};
