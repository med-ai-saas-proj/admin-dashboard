import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";

export type MarkInvoiceAsPaidCredentials = {
	invoiceId: string;
};

export const markInvoiceAsPaid = async ({
	invoiceId,
}: MarkInvoiceAsPaidCredentials) => {
	const response = await apiClient.put<null>(
		`${API_ROUTES.MANAGEMENT.BILLING}/invoices/${invoiceId}/mark_paid`
	);
	return toApiResponse(response.data);
};
