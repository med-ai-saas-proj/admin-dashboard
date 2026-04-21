import { useQuery } from "@tanstack/react-query";
import { getInvoices, type InvoiceParams } from "../services/get-invoices";

export const useGetInvoices = (params: InvoiceParams) => {
	return useQuery({
		queryKey: ["invoices", params],
		queryFn: () => getInvoices(params),
	});
};
