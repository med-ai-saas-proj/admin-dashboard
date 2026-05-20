import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";

export type CreditsOrganizationParams = {
	organizationId: string | null;
};

export const getCreditsOrganization = async ({
	organizationId,
}: CreditsOrganizationParams) => {
	if (!organizationId) throw new Error("organizationId is required");

	const { data } = await apiClient.get<{ amount: number }>(
		`${API_ROUTES.MANAGEMENT.BILLING}/credits/${organizationId}/available`
	);
	return data;
};
