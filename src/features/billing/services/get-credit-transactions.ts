import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";

export type CreditTransactionParams = {
	offset: number;
	limit: number;
};

export const getCreditTransactions = async (
	params: CreditTransactionParams
) => {
	const response = await apiClient.get(
		`${API_ROUTES.MANAGEMENT.BILLING}/credits/transactions`,
		{
			params,
		}
	);
	return response.data;
};
