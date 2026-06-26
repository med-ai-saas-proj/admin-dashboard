import { getApiErrorMessage } from "@/lib/error";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const query_client = new QueryClient({
	// TODO: Set using ENV for dev and production values
	defaultOptions: {
		queries: {
			retry: 0,
			refetchOnWindowFocus: false,
			staleTime: 0,
		},
	},
	queryCache: new QueryCache({
		onError: (error, query) => {
			if (query.state.data !== undefined) {
				toast.error(getApiErrorMessage(error));
			}
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	}),
});
