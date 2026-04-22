import { useMutation } from "@tanstack/react-query";
import { query_client } from "@/query/query-client";
import {
	addCredits,
	type AddCreditsCredentials,
} from "../services/add-credits";

export const useAddCredits = () => {
	return useMutation({
		mutationKey: ["addC-credits"],
		mutationFn: (credentials: AddCreditsCredentials) => addCredits(credentials),
		onSuccess: async () => {
			await query_client.invalidateQueries({
				queryKey: ["creditTransactions"],
			});
		},
	});
};
