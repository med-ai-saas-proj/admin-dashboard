import type { ApiResponse, PaginatedResponse } from "@/lib/response";

export type AdminProjectDetailsUsers = {
	id: string;
	username: string | null;
	email: string | null;
};

export type AdminProjectDetailsSettings = {
	rate_limit: number;
	spending_limit: number;
};

export type UpdateUserPermissionsInProject = {
	permissions: string[];
};

export type AdminProjectDetailsUsersResponse = PaginatedResponse<
	AdminProjectDetailsUsers[]
>;
export type AdminProjectDetailsSettingsResponse =
	ApiResponse<AdminProjectDetailsSettings>;
export type UpdateUserPermissionsInProjectResponse =
	ApiResponse<UpdateUserPermissionsInProject>;
