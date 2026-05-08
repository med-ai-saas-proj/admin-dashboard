import { useMutation } from "@tanstack/react-query";
import {
	updateAdminUserPermissions,
	type UpdateAdminUserPermissionsParams,
} from "../services/update-admin-user-permissions";

export const useUpdateAdminUserPermissions = () => {
	return useMutation({
		mutationFn: (params: UpdateAdminUserPermissionsParams) =>
			updateAdminUserPermissions(params),
	});
};
