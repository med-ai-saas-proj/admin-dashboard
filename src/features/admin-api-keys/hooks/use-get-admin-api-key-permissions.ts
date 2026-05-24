import { useQuery } from "@tanstack/react-query";
import { getApiKeyPermissions } from "../services/get-admin-api-key-permissions";
import type { AdminApiKeyPermissionsResponse } from "../types/admin-api-keys";

export const useGetAdminApiKeyPermissions = () => {
	return useQuery<AdminApiKeyPermissionsResponse>({
		queryKey: ["admin-api-key-permissions"],
		queryFn: async () => {
			const response = await getApiKeyPermissions();
			return {
				...response,
				total: response.results.length,
			};
		},
	});
};
