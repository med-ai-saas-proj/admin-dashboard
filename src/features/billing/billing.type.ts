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

export type InvoiceDetails = {
	invoice_uid: string;
	billing_period: string;
	total_amount: string;
	paid_at: string;
	details: {
		additionalProperty: string;
	};
	used_credits: string;
	line_items: {
		description: string;
		amount: string;
		project_uuid: string;
		project_name: string;
	}[];
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

// export type Transactions = {
// 	transactionId: string;
// 	amount: number; // Số tiền đã nạp (VD: 150000)
// 	creditsAdded: number;
// 	status: "CAPTURED" | "EXPIRED" | "PENDING" | "REFUNDED";
// 	paymentMethod: string;
// 	description: string;
// 	errorMessage: string | null; // Sẽ có text nếu status là FAILED (VD: "Insufficient funds")
// 	createdAt: string | Date;
// 	invoiceId: string; // Link tới hóa đơn tương ứng (nếu có)
// };

export type Transaction = {
	transaction_uid: string;
	amount: string;
	project_uid: string;
	captured_at: string;
	status: "CAPTURED" | "EXPIRED" | "PENDING" | "REFUNDED";
	description?: string;
	errorMessage?: string | null;
};

export type Invoices = PaginatedResponse<Invoice[]>;
export type InvoiceDetailsResponse = ApiResponse<InvoiceDetails>;
export type AddCreditsResponse = PaginatedResponse<AddCredits>;
export type CreditTransactions = PaginatedResponse<CreditTransaction[]>;
export type LifetimeValueResponse = ApiResponse<LifetimeValue>;
export type TransactionsResponse = PaginatedResponse<Transaction[]>;
