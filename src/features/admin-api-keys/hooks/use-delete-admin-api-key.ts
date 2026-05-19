import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import {
	deleteAdminApiKey,
	type DeleteAdminApiKeyCredentials,
} from "../services/delete-admin-api-key";
import type { AdminApiKeysResponse } from "../types/admin-api-keys";

interface DeleteAdminApiKeyContext {
	previous?: Array<[QueryKey, AdminApiKeysResponse | undefined]>;
}

export const useDeleteAdminApiKey = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutation<
		null,
		Error,
		DeleteAdminApiKeyCredentials,
		DeleteAdminApiKeyContext
	>({
		mutationKey: ["delete-admin-api-key"],
		mutationFn: (credentials: DeleteAdminApiKeyCredentials) =>
			deleteAdminApiKey(credentials),
		onMutate: async (params) => {
			await queryClient.cancelQueries({
				queryKey: ["admin-api-keys"],
			});

			const previous = queryClient.getQueriesData({
				queryKey: ["admin-api-keys"],
				exact: false,
			}) as Array<[QueryKey, AdminApiKeysResponse | undefined]>;

			previous.forEach(([key]) => {
				queryClient.setQueryData<AdminApiKeysResponse | undefined>(
					key,
					(old) => {
						if (!old) return old;

						return {
							...old,
							data: (old.data ?? []).filter(
								(item) => item.api_key_uuid !== params.apiKeyId
							),
						};
					}
				);
			});

			return { previous };
		},
		onError: (_err, _vars, context) => {
			if (!context?.previous) return;

			context.previous.forEach(([key, data]) => {
				queryClient.setQueryData(key, data);
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin-api-keys", projectId],
			});
		},
	});
};
