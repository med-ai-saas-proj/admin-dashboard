import { API_ROUTES } from "@/config/api-routes";
import { toApiResponse } from "@/lib/response";
import apiClient from "@/query/api-client";

export type MarkInvoiceAsRefundedCredentials = {
	invoiceId: string;
};

export const markInvoiceAsRefunded = async ({
	invoiceId,
}: MarkInvoiceAsRefundedCredentials) => {
	const response = await apiClient.post<null>(
		`${API_ROUTES.MANAGEMENT.BILLING}/invoices/${invoiceId}/refund`
	);
	return toApiResponse(response.data);
};
