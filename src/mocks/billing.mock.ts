import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const billingInvoicesUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/invoices(?:\\?.*)?$`
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

	return {
		invoice_uid: `INV-${Mock.Random.string("upper", 8)}-${index + 1}`,
		billing_period: Mock.Random.date("yyyy-MM"),
		total_amount: amount.toFixed(2),
		paid_at: isPaid ? Mock.Random.datetime("yyyy-MM-dd HH:mm:ss") : "",
		details: {
			additionalProperty: isPaid ? "Paid successfully" : "Payment pending",
		},
		used_credits: Mock.Random.integer(10, 250).toString(),
	};
};

Mock.mock(billingInvoicesUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const limit = Number(requestUrl.searchParams.get("limit") ?? 10);
	const offset = Number(requestUrl.searchParams.get("offset") ?? 0);
	const paid = requestUrl.searchParams.get("paid");
	const shouldReturnPaid = paid === null ? undefined : paid === "true";

	const allInvoices = Array.from({ length: 20 }, (_, index) =>
		generateInvoice(index)
	);
	const filteredInvoices =
		shouldReturnPaid === undefined
			? allInvoices
			: allInvoices.filter(
					(_, index) => (index % 3 !== 0) === shouldReturnPaid
				);
	const pagedInvoices = filteredInvoices.slice(offset, offset + limit);

	return {
		success: true,
		data: pagedInvoices,
		total: filteredInvoices.length,
		offset,
		limit,
	};
});
