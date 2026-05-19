import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type {
	CreditTransaction,
	LifetimeValue,
	Transactions,
} from "@/features/billing/billing.type";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const billingInvoicesUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/invoices(?:\\?.*)?$`
);

const billingCreditTransactionsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/credits/[^/]+/transactions(?:\\?.*)?$`
);

const billingTransactionsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/transactions(?:\\?.*)?$`
);

const billingCreditsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/credits(?:\\?.*)?$`
);

const billingLifetimeValueUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/lifetime-value(?:\\?.*)?$`
);

type InvoiceRecord = {
	invoice_uid: string;
	billing_period: string;
	total_amount: string;
	paid_at: string;
	details: {
		additionalProperty: string;
	};
	used_credits: string;
};

const generateInvoice = (index: number): InvoiceRecord => {
	const isPaid = index % 3 !== 0;
	const amount = Mock.Random.float(25, 5000, 2, 2);

	// Generate dates for the last 12 months
	const monthsBack = index % 12;
	const invoiceDate = new Date();
	invoiceDate.setMonth(invoiceDate.getMonth() - monthsBack);
	const billingPeriod = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, "0")}`;

	return {
		invoice_uid: `INV-${Mock.Random.string("upper", 8)}-${index + 1}`,
		billing_period: billingPeriod,
		total_amount: amount.toFixed(2),
		paid_at: isPaid ? Mock.Random.datetime("yyyy-MM-dd HH:mm:ss") : "",
		details: {
			additionalProperty: isPaid ? "Paid successfully" : "Payment pending",
		},
		used_credits: Mock.Random.integer(10, 250).toString(),
	};
};

const generateCreditTransaction = (): CreditTransaction => {
	const amount = Mock.Random.float(50, 2500, 2, 2);

	// Generate dates spread across the last 90 days
	const daysBack = Mock.Random.integer(0, 90);
	const createdAtDate = new Date();
	createdAtDate.setDate(createdAtDate.getDate() - daysBack);
	createdAtDate.setHours(
		Mock.Random.integer(0, 23),
		Mock.Random.integer(0, 59),
		Mock.Random.integer(0, 59)
	);
	const createdAt = createdAtDate.toISOString().slice(0, 19).replace("T", " ");

	return {
		amount: amount.toFixed(2),
		description: Mock.Random.pick([
			"Manual credit top-up",
			"Promotional credit granted",
			"Billing adjustment credit",
			"Referral bonus credit",
			"System credit adjustment",
		]),
		created_at: createdAt,
	};
};

const transactionTypes: Transactions["type"][] = [
	"TOPUP",
	"SUBSCRIPTION",
	"SUBSCRIPTION_FEE",
	"OVERAGE_FEE",
	"REFUND",
];

const transactionStatuses: Transactions["status"][] = [
	"PENDING",
	"CAPTURED",
	"EXPIRED",
];

const generateRecentDateIso = (maxDaysBack = 45): string => {
	const date = new Date();
	const daysBack = Mock.Random.integer(0, maxDaysBack);
	date.setDate(date.getDate() - daysBack);
	date.setHours(
		Mock.Random.integer(0, 23),
		Mock.Random.integer(0, 59),
		Mock.Random.integer(0, 59),
		0
	);

	return date.toISOString();
};

const generateTransaction = (index: number): Transactions => {
	const type = Mock.Random.pick(transactionTypes);
	const status = Mock.Random.pick(transactionStatuses);
	const creditsAdded =
		type === "REFUND" ? 0 : Mock.Random.integer(5000, 250000);
	const amount =
		type === "REFUND"
			? Mock.Random.float(10, 500, 2, 2)
			: Mock.Random.float(25, 2500, 2, 2);

	return {
		transactionId: `TXN-${Mock.Random.string("upper", 6)}-${index + 1}`,
		amount: Number(amount.toFixed(2)),
		creditsAdded,
		type,
		status,
		paymentMethod: Mock.Random.pick([
			"Visa",
			"Mastercard",
			"Amex",
			"Bank transfer",
		]),
		description: Mock.Random.pick([
			"Top-up processed successfully",
			"Monthly subscription charged",
			"Manual billing adjustment",
			"Usage overage billed",
			"Refund issued for failed charge",
		]),
		errorMessage:
			status === "FAILED"
				? Mock.Random.pick([
						"Card declined",
						"Insufficient funds",
						"Payment gateway timeout",
					])
				: null,
		createdAt: generateRecentDateIso(),
		invoiceId: Mock.Random.bool()
			? `INV-${Mock.Random.string("upper", 6)}-${index + 1}`
			: "",
	};
};

const transactions = Array.from({ length: 48 }, (_, index) =>
	generateTransaction(index)
).sort((left, right) =>
	String(right.createdAt).localeCompare(String(left.createdAt))
);

const creditTransactions = Array.from({ length: 20 }, () =>
	generateCreditTransaction()
).sort((left, right) => right.created_at.localeCompare(left.created_at));

const firstPaymentDate = new Date();
firstPaymentDate.setMonth(firstPaymentDate.getMonth() - 14);

const lastPaymentDate = new Date();
lastPaymentDate.setDate(lastPaymentDate.getDate() - 2);

const lifetimeValueData: LifetimeValue = {
	lifetimeRevenue: 128450.75,
	totalSuccessfulTransactions: 321,
	totalRefundedAmount: 2480.2,
	currentOutstandingBalance: 920.5,
	firstPaymentDate,
	lastPaymentDate,
};

Mock.mock(billingInvoicesUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const limit = Number(requestUrl.searchParams.get("limit") ?? 10);
	const offset = Number(requestUrl.searchParams.get("offset") ?? 0);
	const paid = requestUrl.searchParams.get("paid");
	const fromDate = requestUrl.searchParams.get("from_date");
	const toDate = requestUrl.searchParams.get("to_date");
	const shouldReturnPaid = paid === null ? undefined : paid === "true";

	const allInvoices = Array.from({ length: 20 }, (_, index) =>
		generateInvoice(index)
	);
	const filteredInvoices = allInvoices.filter((invoice) => {
		const matchesPaid =
			shouldReturnPaid === undefined
				? true
				: (invoice.paid_at !== "") === shouldReturnPaid;

		const matchesDateRange =
			!fromDate && !toDate
				? true
				: invoice.billing_period >= (fromDate ?? "") &&
					invoice.billing_period <= (toDate ?? "9999-99");

		return matchesPaid && matchesDateRange;
	});
	const pagedInvoices = filteredInvoices.slice(offset, offset + limit);

	return {
		success: true,
		data: pagedInvoices,
		total: filteredInvoices.length,
		offset,
		limit,
	};
});

Mock.mock(billingCreditTransactionsUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const limit = Number(requestUrl.searchParams.get("limit") ?? 10);
	const offset = Number(requestUrl.searchParams.get("offset") ?? 0);
	const pagedTransactions = creditTransactions.slice(offset, offset + limit);

	return {
		success: true,
		data: pagedTransactions,
		total: creditTransactions.length,
		offset,
		limit,
	};
});

Mock.mock(billingTransactionsUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const page = Number(requestUrl.searchParams.get("page") ?? 1);
	const perPage = Number(
		requestUrl.searchParams.get("per_page") ??
			requestUrl.searchParams.get("limit") ??
			20
	);
	const offsetFromPage = (page - 1) * perPage;
	const offset = Number(
		requestUrl.searchParams.get("offset") ?? offsetFromPage
	);
	const limit = Number(requestUrl.searchParams.get("limit") ?? perPage);
	const status = requestUrl.searchParams.get("status");
	const type = requestUrl.searchParams.get("type");
	const transactionId = requestUrl.searchParams
		.get("transaction_id")
		?.trim()
		.toLowerCase();
	const startDate = requestUrl.searchParams.get("start_date");
	const endDate = requestUrl.searchParams.get("end_date");

	const filteredTransactions = transactions.filter((transaction) => {
		const transactionDay = String(transaction.createdAt).slice(0, 10);
		const matchesStatus = status ? transaction.status === status : true;
		const matchesType = type ? transaction.type === type : true;
		const matchesTransactionId = transactionId
			? transaction.transactionId.toLowerCase().includes(transactionId)
			: true;
		const matchesStartDate = startDate ? transactionDay >= startDate : true;
		const matchesEndDate = endDate ? transactionDay <= endDate : true;

		return (
			matchesStatus &&
			matchesType &&
			matchesTransactionId &&
			matchesStartDate &&
			matchesEndDate
		);
	});

	const pagedTransactions = filteredTransactions.slice(offset, offset + limit);

	return {
		success: true,
		data: pagedTransactions,
		total: filteredTransactions.length,
		offset,
		limit,
	};
});

Mock.mock(billingCreditsUrl, "post", (options: { body?: string }) => {
	const body = options.body ? JSON.parse(options.body) : {};
	const amountValue = Number(body?.amount?.value ?? 0);
	const amountScale = Number(body?.amount?.scale ?? 0);
	const normalizedAmount =
		amountScale > 0 ? amountValue / 10 ** amountScale : amountValue;

	const newTransaction: CreditTransaction = {
		amount: normalizedAmount.toFixed(amountScale),
		description: body?.description ?? "",
		created_at: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
	};

	creditTransactions.unshift(newTransaction);

	return {
		success: true,
		data: {
			amount: newTransaction.amount,
		},
	};
});

Mock.mock(billingLifetimeValueUrl, "get", () => {
	return {
		success: true,
		data: lifetimeValueData,
	};
});
