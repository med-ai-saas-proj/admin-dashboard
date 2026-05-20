import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { InvoiceDetailsResponse } from "../billing.type";

export type MarkInvoiceAsPaidCredentials = {
	invoiceId: string;
};

export const markInvoiceAsPaid = async ({
	invoiceId,
}: MarkInvoiceAsPaidCredentials) => {
	const response = await apiClient.post<InvoiceDetailsResponse>(
		`${API_ROUTES.MANAGEMENT.BILLING}/invoices/${invoiceId}/mark_paid`
	);
	return response.data;
};
