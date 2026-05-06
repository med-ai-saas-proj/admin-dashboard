export interface ApiResponse<T> {
	success: boolean;
	data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
	total: number;
	offset: number;
	limit: number;
}
