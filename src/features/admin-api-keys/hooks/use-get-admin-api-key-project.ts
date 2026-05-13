import { useQuery } from "@tanstack/react-query";
import { getAdminApiKeysProject } from "../services/get-admin-api-keys-project";
import type { AdminApiKeysResponse } from "../types/admin-api-keys";

export const useGetAdminApiKeysProject = (projectId: string) => {
	return useQuery<AdminApiKeysResponse>({
		queryKey: ["admin-api-keys", projectId],
		queryFn: () => getAdminApiKeysProject({ projectId }),
		enabled: !!projectId,
	});
};
