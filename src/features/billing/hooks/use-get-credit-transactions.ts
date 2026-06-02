import { useQuery } from "@tanstack/react-query";
import {
	getCreditTransactions,
	type CreditTransactionParams,
} from "../services/get-credit-transactions";

export const useGetCreditTransactions = (params: CreditTransactionParams) => {
	return useQuery({
		queryKey: ["credit-transactions", params],
		queryFn: () => getCreditTransactions(params),
		placeholderData: (previousData) => previousData,
	});
};
