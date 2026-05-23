import { useMutation, type QueryKey } from "@tanstack/react-query";
import { createAdminApiKey } from "../services/create-admin-api-key";
import type { CreateAdminApiKeyCredentials } from "../services/create-admin-api-key";
import type {
	AdminApiKeysResponse,
	AdminApiKeyResponse,
} from "../types/admin-api-keys";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateAdminApiKey = () => {
	const queryClient = useQueryClient();

	return useMutation<
		AdminApiKeyResponse,
		Error,
		CreateAdminApiKeyCredentials,
		{ previous?: Array<[QueryKey, AdminApiKeysResponse | undefined]> }
	>({
		mutationKey: ["create-admin-api-key"],
		mutationFn: (credentials) => createAdminApiKey(credentials),
		onMutate: async (credentials) => {
			await queryClient.cancelQueries({ queryKey: ["admin-api-keys"] });

			const previous = queryClient.getQueriesData<AdminApiKeysResponse>({
				queryKey: ["admin-api-keys"],
				exact: false,
			}) as Array<[QueryKey, AdminApiKeysResponse | undefined]>;

			previous.forEach(([key]) => {
				queryClient.setQueryData<AdminApiKeysResponse | undefined>(
					key,
					(old) => {
						if (!old) return old;

						const newApiKey: AdminApiKeyResponse = {
							success: true,
							results: {
								api_key_uuid: "temp-id",
								project_uuid: credentials.projectId,
								name: credentials.name,
								description: credentials.description,
								hint: "",
								created_at: new Date().toISOString(),
								permissions: credentials.permissions,
								disabled: false,
							},
						};

						return {
							...old,
							results: [...old.results, newApiKey.results],
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
			queryClient.invalidateQueries({ queryKey: ["admin-api-keys"] });
		},
	});
};
