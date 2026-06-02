export interface ApiResponse<T> {
	success: boolean;
	results: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
	total: number;
	offset?: number;
	limit?: number;
}

export const isApiResponse = <T>(value: unknown): value is ApiResponse<T> => {
	return (
		typeof value === "object" &&
		value !== null &&
		"success" in value &&
		"results" in value
	);
};

export const toApiResponse = <T>(
	payload: ApiResponse<T> | T
): ApiResponse<T> => {
	if (isApiResponse<T>(payload)) {
		return payload;
	}

	return {
		success: true,
		results: payload,
	};
};

export interface ApiBillingResponse<T> {
	success: boolean;
	data: T;
}

export const isApiBillingResponse = <T>(
	value: unknown
): value is ApiBillingResponse<T> => {
	return (
		typeof value === "object" &&
		value !== null &&
		"success" in value &&
		"data" in value
	);
};

export const toApiBillingResponse = <T>(
	payload: ApiBillingResponse<T> | T
): ApiBillingResponse<T> => {
	if (isApiBillingResponse<T>(payload)) {
		return payload;
	}

	return {
		success: true,
		data: payload,
	};
};
