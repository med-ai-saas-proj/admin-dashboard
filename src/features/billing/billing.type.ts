import type { ApiResponse, PaginatedResponse } from "@/lib/response";

export type Invoice = {
	invoice_uid: string;
	billing_period: string;
	total_amount: string;
	paid_at: string;
	details: {
		additionalProperty: string;
	};
	used_credits: string;
};

export type AddCredits = {
	amount: string;
};

export type CreditTransaction = {
	amount: string;
	description: string;
	created_at: string;
};

export type LifetimeValue = {
	lifetimeRevenue: number; // TỔNG TIỀN ĐÃ THANH TOÁN (Chỉ cộng giao dịch SUCCESS)
	totalSuccessfulTransactions: number; // Số lần quẹt thẻ thành công
	totalRefundedAmount: number; // (Optional) Số tiền hệ thống từng hoàn trả lại cho họ
	currentOutstandingBalance: number; // Tổ chức đang nợ hệ thống (Ví dụ do hóa đơn tháng này quẹt thẻ xịt)
	firstPaymentDate: Date; // Ngày họ trả tiền lần đầu tiên (Giúp tính dòng đời KH)
	lastPaymentDate: Date; // Rất quan trọng để biết tổ chức này còn "Active buyer" không
};

export type Transactions = {
	transactionId: string;
	amount: number; // Số tiền đã nạp (VD: 150000)
	creditsAdded: number;
	type:
		| "TOPUP"
		| "SUBSCRIPTION"
		| "SUBSCRIPTION_FEE"
		| "OVERAGE_FEE"
		| "REFUND"; // TOPUP, SUBSCRIPTION, SUBSCRIPTION_FEE, OVERAGE_FEE, REFUND
	status: "SUCCESS" | "FAILED" | "PENDING" | "REFUNDED"; // SUCCESS, FAILED, PENDING, REFUNDED
	paymentMethod: string;
	description: string;
	errorMessage: string | null; // Sẽ có text nếu status là FAILED (VD: "Insufficient funds")
	createdAt: string | Date;
	invoiceId: string; // Link tới hóa đơn tương ứng (nếu có)
};

export type Invoices = PaginatedResponse<Invoice[]>;
export type AddCreditsResponse = PaginatedResponse<AddCredits>;
export type CreditTransactions = PaginatedResponse<CreditTransaction[]>;
export type LifetimeValueResponse = ApiResponse<LifetimeValue>;
export type TransactionsResponse = PaginatedResponse<Transactions[]>;
