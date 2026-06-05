import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { AddCreditsResponse } from "../billing.type";

export type AddCreditsCredentials = {
	organizationId: string;
	amount: {
		value: number;
		scale: number;
	};
	description: string;
};

export const addCredits = async (credentials: AddCreditsCredentials) => {
	const response = await apiClient.post<AddCreditsResponse>(
		`${API_ROUTES.MANAGEMENT.BILLING}/credits`,
		{
			org_id: credentials.organizationId,
			amount: credentials.amount,
			description: credentials.description,
		}
	);

	return response.data;
};
