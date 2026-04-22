import { useMutation } from "@tanstack/react-query";
import {
	addCredits,
	type AddCreditsCredentials,
} from "../services/add-credits";

export const useAddCredits = () => {
	return useMutation({
		mutationKey: ["addC-credits"],
		mutationFn: (credentials: AddCreditsCredentials) => addCredits(credentials),
	});
};
