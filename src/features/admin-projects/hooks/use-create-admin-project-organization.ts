import {
	useMutation,
	useQueryClient,
	// type QueryKey,
} from "@tanstack/react-query";
import {
	createAdminProjectOrganization,
	type CreateAdminProjectOrganizationCredentials,
} from "../services/create-admin-project-organization";
// import type {
// 	AdminProjectOrganization,
// 	AdminProjectsOrganizationResponse,
// } from "../types/admin-projects";

export const useCreateAdminProjectOrganization = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["create-admin-project-organization"],
		mutationFn: (credentials: CreateAdminProjectOrganizationCredentials) =>
			createAdminProjectOrganization(credentials),
		onSuccess: (_, variables) => {
			const organizationQueryKey = [
				"admin-projects-organization",
				variables.organizationId,
			] as const;
			queryClient.invalidateQueries({
				queryKey: organizationQueryKey,
			});
		},
		// onMutate: async (credentials) => {
		// 	const organizationQueryKey = [
		// 		"admin-projects-organization",
		// 		credentials.organizationId,
		// 	] as const;

		// 	await queryClient.cancelQueries({
		// 		queryKey: organizationQueryKey,
		// 	});

		// 	const previousData = queryClient.getQueriesData({
		// 		queryKey: organizationQueryKey,
		// 	}) as Array<[QueryKey, AdminProjectsOrganizationResponse | undefined]>;

		// 	const optimistic: AdminProjectOrganization = {
		// 		project_uuid: `tmp_${Math.random().toString(36).slice(2, 9)}`,
		// 		name: credentials.name,
		// 		description: credentials.description,
		// 		organization_id: credentials.organizationId,
		// 		archived: false,
		// 	};

		// 	previousData.forEach(([key]) => {
		// 		queryClient.setQueryData<AdminProjectsOrganizationResponse | undefined>(
		// 			key,
		// 			(old) => {
		// 				const prev = old ?? {
		// 					success: true,
		// 					results: [],
		// 					total: 0,
		// 					offset: 0,
		// 					limit: 10,
		// 				};

		// 				return {
		// 					...prev,
		// 					results: [optimistic, ...(prev.results ?? [])],
		// 					total: (prev.total ?? 0) + 1,
		// 				};
		// 			}
		// 		);
		// 	});

		// 	if (previousData.length === 0) {
		// 		queryClient.setQueryData<AdminProjectsOrganizationResponse>(
		// 			organizationQueryKey,
		// 			{
		// 				success: true,
		// 				results: [optimistic],
		// 				total: 1,
		// 				offset: 0,
		// 				limit: 10,
		// 			}
		// 		);
		// 	}

		// 	return { previousData };
		// },
		// onError: (_err, _vars, context) => {
		// 	if (!context?.previousData) return;

		// 	context.previousData.forEach(([key, data]) => {
		// 		queryClient.setQueryData(key, data);
		// 	});
		// },
	});
};
