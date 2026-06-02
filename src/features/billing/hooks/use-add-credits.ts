import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	addCredits,
	type AddCreditsCredentials,
} from "../services/add-credits";

export const useAddCredits = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["add-credits"],
		mutationFn: (credentials: AddCreditsCredentials) => addCredits(credentials),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["credit-transactions"],
				exact: false,
			});
		},
	});
};
