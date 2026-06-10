import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	markInvoiceAsPaid,
	type MarkInvoiceAsPaidCredentials,
} from "../services/mark-invoice-as-paid";

export const useMarkInvoiceAsPaid = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["mark-invoice-as-paid"],
		mutationFn: (credentials: MarkInvoiceAsPaidCredentials) =>
			markInvoiceAsPaid(credentials),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["invoices"],
				exact: false,
			});
		},
	});

	return mutation;
};
