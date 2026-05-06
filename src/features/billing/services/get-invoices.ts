import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { Invoices } from "../billing.type";

export type InvoiceParams = {
	fromDate?: Date;
	toDate?: Date;
	paid?: boolean;
	limit?: number;
	offset?: number;
};

export const getInvoices = async (params: InvoiceParams) => {
	const response = await apiClient.get<Invoices>(
		`${API_ROUTES.MANAGEMENT.BILLING}/invoices`,
		{ params }
	);
	return response.data;
};
