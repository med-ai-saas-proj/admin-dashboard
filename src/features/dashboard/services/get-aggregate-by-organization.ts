import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AggregateParams, AggregateResponse } from "../dashboard.type";

export const getAggregateByOrganization = async (
	params: AggregateParams
): Promise<AggregateResponse> => {
	const response = await apiClient.get<AggregateResponse>(
		`${API_ROUTES.MANAGEMENT.BILLING}/aggregates/organizations`,
		{
			params: {
				period_start: params.periodStart,
				period_end: params.periodEnd,
				period: params.period,
				period_scale: params.periodScale,
				org_id: params.organizationId,
			},
		}
	);
	return response.data;
};
