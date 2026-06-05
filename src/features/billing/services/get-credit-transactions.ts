import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { CreditTransactionsResponse } from "../billing.type";

export type CreditTransactionParams = {
	organizationId: string;
	offset: number;
	limit: number;
};

export const getCreditTransactions = async (
	params: CreditTransactionParams
) => {
	const response = await apiClient.get<CreditTransactionsResponse>(
		`${API_ROUTES.MANAGEMENT.BILLING}/credits/${params.organizationId}/transactions`,
		{
			params: {
				offset: params.offset,
				limit: params.limit,
			},
		}
	);
	return response.data;
};
