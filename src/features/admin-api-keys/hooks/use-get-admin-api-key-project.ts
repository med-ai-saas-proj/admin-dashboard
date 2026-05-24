import { useQuery } from "@tanstack/react-query";
import { getAdminApiKeysProject } from "../services/get-admin-api-keys-project";
import type { AdminApiKeysResponse } from "../types/admin-api-keys";

export const useGetAdminApiKeysProject = (projectId: string) => {
	return useQuery<AdminApiKeysResponse>({
		queryKey: ["admin-api-keys", projectId],
		queryFn: async () => {
			const response = await getAdminApiKeysProject({ projectId });
			return {
				...response,
				total: response.results.length,
			};
		},
		enabled: !!projectId,
	});
};
