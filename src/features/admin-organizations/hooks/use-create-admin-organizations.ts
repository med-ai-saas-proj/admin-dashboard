import {
	useMutation,
	useQueryClient,
	type QueryKey,
} from "@tanstack/react-query";
import {
	createAdminOrganization,
	type CreateAdminOrganizationsCredentials,
} from "../services/create-admin-organization";
import type {
	AdminOrganization,
	AdminOrganizationsListResponse,
} from "../types/admin-organizations";

export const useCreateAdminOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["create-admin-organization"],
		mutationFn: (credentials: CreateAdminOrganizationsCredentials) =>
			createAdminOrganization(credentials),
		onMutate: async (newOrg) => {
			await queryClient.cancelQueries({
				queryKey: ["admin-organizations"],
			});

			const previous = queryClient.getQueriesData({
				queryKey: ["admin-organizations"],
			}) as Array<[QueryKey, AdminOrganizationsListResponse | undefined]>;

			const optimistic: AdminOrganization = {
				org_id: `tmp_${Math.random().toString(36).slice(2, 9)}`,
				name: newOrg.name,
				owner_id: newOrg.owner_id ?? null,
				requested_at: "",
				delete_at: "",
			};

			previous.forEach(([key]) => {
				queryClient.setQueryData<AdminOrganizationsListResponse | undefined>(
					key,
					(old) => {
						const prev = old ?? {
							success: true,
							results: [],
							total: 0,
							offset: 0,
							limit: 10,
						};
						return {
							...prev,
							results: [optimistic, ...(prev.results ?? [])],
							total: (prev.total ?? 0) + 1,
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
				queryKey: ["admin-organizations"],
			});
		},
	});
};
