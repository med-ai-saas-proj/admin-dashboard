import type { PaginatedResponse } from "@/lib/response";

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

export type Invoices = PaginatedResponse<Invoice[]>;
export type AddCreditsResponse = PaginatedResponse<AddCredits>;
export type CreditTransactions = PaginatedResponse<CreditTransaction[]>;
