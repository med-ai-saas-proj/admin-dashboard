import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type {
	Invoice,
	InvoiceDetails,
	CreditTransaction,
	LifetimeValue,
	Transactions,
} from "@/features/billing/billing.type";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const billingInvoicesUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/invoices(?:[?].*)?$`
);

const billingInvoiceDetailsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/invoices/[^/]+(?:[?].*)?$`
);

const billingInvoiceMarkPaidUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/invoices/[^/]+/mark_paid(?:[?].*)?$`
);

const billingInvoiceRefundUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/invoices/[^/]+/refund(?:[?].*)?$`
);

const billingCreditTransactionsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/credits/[^/]+/transactions(?:[?].*)?$`
);

const billingTransactionsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/transactions(?:[?].*)?$`
);

const billingCreditsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/credits(?:[?].*)?$`
);

const billingLifetimeValueUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/lifetime-value(?:[?].*)?$`
);

type InvoiceRecord = InvoiceDetails;

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
		line_items: [
			{
				description: Mock.Random.pick([
					"Monthly subscription",
					"Usage overage",
					"Billing adjustment",
				]),
				amount: amount.toFixed(2),
				project_uuid: `PRJ-${Mock.Random.string("upper", 6)}-${index + 1}`,
				project_name: Mock.Random.pick([
					"Atlas",
					"Northstar",
					"Velocity",
					"Aurora",
				]),
			},
		],
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
	const status = Mock.Random.pick(transactionStatuses);
	const creditsAdded = Mock.Random.integer(5000, 250000);
	const amount = Mock.Random.float(25, 2500, 2, 2);

	return {
		transactionId: `TXN-${Mock.Random.string("upper", 6)}-${index + 1}`,
		amount: Number(amount.toFixed(2)),
		creditsAdded,
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

const invoiceRecords = Array.from({ length: 20 }, (_, index) =>
	generateInvoice(index)
).sort((left, right) => left.invoice_uid.localeCompare(right.invoice_uid));

const toInvoiceSummary = ({
	line_items: _lineItems,
	...invoice
}: InvoiceRecord): Invoice => invoice;

const findInvoiceById = (invoiceId: string) =>
	invoiceRecords.find((invoice) => invoice.invoice_uid === invoiceId);

const updateInvoiceStatus = (
	invoiceId: string,
	status: "paid" | "refunded"
) => {
	const invoice = findInvoiceById(invoiceId);

	if (!invoice) {
		return null;
	}

	const timestamp = Mock.Random.datetime("yyyy-MM-dd HH:mm:ss");

	if (status === "paid") {
		invoice.paid_at = invoice.paid_at || timestamp;
		invoice.details.additionalProperty = "Paid successfully";
	} else {
		invoice.details.additionalProperty = "Refunded successfully";
	}

	return invoice;
};

Mock.mock(billingInvoiceDetailsUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const invoiceId = requestUrl.pathname.split("/").pop() ?? "";
	const invoice = findInvoiceById(invoiceId);

	if (!invoice) {
		return {
			success: false,
			data: null,
		};
	}

	return {
		success: true,
		data: invoice,
	};
});

Mock.mock(billingInvoiceMarkPaidUrl, "post", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const invoiceId = requestUrl.pathname.split("/").slice(-2, -1)[0] ?? "";
	const invoice = updateInvoiceStatus(invoiceId, "paid");

	return {
		success: !!invoice,
		data: invoice,
	};
});

Mock.mock(billingInvoiceMarkPaidUrl, "put", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const invoiceId = requestUrl.pathname.split("/").slice(-2, -1)[0] ?? "";
	const invoice = updateInvoiceStatus(invoiceId, "paid");

	return {
		success: !!invoice,
		data: invoice,
	};
});

Mock.mock(billingInvoiceRefundUrl, "post", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const invoiceId = requestUrl.pathname.split("/").slice(-2, -1)[0] ?? "";
	const invoice = updateInvoiceStatus(invoiceId, "refunded");

	return {
		success: !!invoice,
		data: invoice,
	};
});

Mock.mock(billingInvoicesUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const limit = Number(requestUrl.searchParams.get("limit") ?? 10);
	const offset = Number(requestUrl.searchParams.get("offset") ?? 0);
	const paid = requestUrl.searchParams.get("paid");
	const fromDate = requestUrl.searchParams.get("from_date");
	const toDate = requestUrl.searchParams.get("to_date");
	const shouldReturnPaid = paid === null ? undefined : paid === "true";

	const filteredInvoices = invoiceRecords.filter((invoice) => {
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
		data: pagedInvoices.map(toInvoiceSummary),
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
	const transactionId = requestUrl.searchParams
		.get("transaction_id")
		?.trim()
		.toLowerCase();
	const startDate = requestUrl.searchParams.get("start_date");
	const endDate = requestUrl.searchParams.get("end_date");

	const filteredTransactions = transactions.filter((transaction) => {
		const transactionDay = String(transaction.createdAt).slice(0, 10);
		const matchesStatus = status ? transaction.status === status : true;
		const matchesTransactionId = transactionId
			? transaction.transactionId.toLowerCase().includes(transactionId)
			: true;
		const matchesStartDate = startDate ? transactionDay >= startDate : true;
		const matchesEndDate = endDate ? transactionDay <= endDate : true;

		return (
			matchesStatus &&
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
