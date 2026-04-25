import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { TransactionsResponse } from "../billing.type";

export type TransactionStatus = "SUCCESS" | "FAILED" | "PENDING" | "REFUNDED";
export type TransactionType =
	| "TOPUP"
	| "SUBSCRIPTION"
	| "SUBSCRIPTION_FEE"
	| "OVERAGE_FEE";

export type TransactionsParams = {
	page?: number; // Trang hiện tại (Mặc định: 1)
	per_page?: number; // Số lượng item mỗi trang (Mặc định: 20)
	status?: TransactionStatus; // (Optional) Lọc theo trạng thái
	type?: TransactionType; // (Optional) Lọc theo loại
	start_date?: string; // (Optional) Lọc từ ngày
	end_date?: string; // (Optional) Lọc đến ngày
	transaction_id?: string; // (Optional) Tìm theo mã giao dịch
};

export const getTransactions = async (
	params: TransactionsParams = {}
): Promise<TransactionsResponse> => {
	const response = await apiClient.get<TransactionsResponse>(
		`${API_ROUTES.MANAGEMENT.BILLING}/transactions`,
		{ params }
	);
	return response.data;
};
