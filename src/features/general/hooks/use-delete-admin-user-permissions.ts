import { useMutation } from "@tanstack/react-query";
import {
	deleteAdminUserPermissions,
	type DeleteAdminUserPermissionsParams,
} from "../services/delete-admin-user-permissions";

export const useDeleteAdminUserPermissions = () => {
	return useMutation({
		mutationFn: (params: DeleteAdminUserPermissionsParams) =>
			deleteAdminUserPermissions(params),
	});
};
