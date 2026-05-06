import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
	getTransactions,
	type TransactionsParams,
} from "../services/get-transactions";
import type { TransactionsResponse } from "../billing.type";

export const useGetTransactions = (params: TransactionsParams) => {
	return useQuery<TransactionsResponse>({
		queryKey: ["transactions", params],
		queryFn: () => getTransactions(params),
		placeholderData: keepPreviousData, // Giữ dữ liệu cũ khi params thay đổi để tránh hiển thị loading state
	});
};
