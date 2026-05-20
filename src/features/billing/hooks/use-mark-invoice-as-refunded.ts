import { useMutation } from "@tanstack/react-query";
import {
	markInvoiceAsRefunded,
	type MarkInvoiceAsRefundedCredentials,
} from "../services/mark-invoice-as-refunded";
import { useQueryClient } from "@tanstack/react-query";

export const useMarkInvoiceAsRefunded = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["mark-invoice-as-refunded"],
		mutationFn: (credentials: MarkInvoiceAsRefundedCredentials) =>
			markInvoiceAsRefunded(credentials),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["invoices"],
				exact: false,
			});
		},
	});

	return mutation;
};
