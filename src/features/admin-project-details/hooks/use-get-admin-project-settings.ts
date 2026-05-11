import { useQuery } from "@tanstack/react-query";
import {
	getAdminProjectSettings,
	type GetAdminProjectSettingsParams,
} from "../services/get-admin-project-settings";

export const useGetAdminProjectSettings = ({
	projectId,
}: GetAdminProjectSettingsParams) => {
	return useQuery({
		queryKey: ["admin-project-settings", projectId],
		queryFn: () => getAdminProjectSettings({ projectId }),
		enabled: !!projectId,
	});
};
