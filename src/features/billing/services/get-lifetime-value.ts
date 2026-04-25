import { API_ROUTES } from "@/config/api-routes";
import apiClient from "@/query/api-client";
import type { LifetimeValueResponse } from "../billing.type";

export const getLifetimeValue = async (): Promise<LifetimeValueResponse> => {
	const response = await apiClient.get<LifetimeValueResponse>(
		`${API_ROUTES.MANAGEMENT.BILLING}/lifetime-value`
	);
	return response.data;
};
