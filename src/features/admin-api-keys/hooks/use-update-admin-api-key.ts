import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import {
	updateAdminApiKey,
	type UpdateAdminApiKeyCredentials,
} from "../services/update-admin-api-key";
import type {
	AdminApiKeyResponse,
	AdminApiKeysResponse,
} from "../types/admin-api-keys";

interface UpdateAdminApiKeyContext {
	previous?: Array<[QueryKey, AdminApiKeysResponse | undefined]>;
}

export const useUpdateAdminApiKey = (projectId: string) => {
	const queryClient = useQueryClient();

	return useMutation<
		AdminApiKeyResponse,
		Error,
		UpdateAdminApiKeyCredentials,
		UpdateAdminApiKeyContext
	>({
		mutationKey: ["update-admin-api-key"],
		mutationFn: (credentials: UpdateAdminApiKeyCredentials) =>
			updateAdminApiKey(credentials),
		onMutate: async (updated) => {
			await queryClient.cancelQueries({
				queryKey: ["admin-api-keys"],
				exact: false,
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
							results: (old.results ?? []).map((item) =>
								item.api_key_uuid === updated.apiKeyId
									? {
											...item,
											name: updated.name,
											description: updated.description,
											permissions: updated.permissions,
										}
									: item
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
