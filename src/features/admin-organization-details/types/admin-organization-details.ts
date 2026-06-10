import type { ApiResponse, PaginatedResponse } from "@/lib/response";

export type AdminUserOrganization = {
	id: string;
	username: string | null;
	email: string | null;
};

export type AdminOrganizationSettings = {
	rate_limit: number;
	spending_limit: number;
	// extra: Record<string, string>;
};

export type UserPermissionsInOrganization = {
	permissions: string[];
};

export type AdminOrganizationUsersResponse = PaginatedResponse<
	AdminUserOrganization[]
>;
export type AdminOrganizationSettingsResponse =
	ApiResponse<AdminOrganizationSettings>;
export type UserPermissionsInOrganizationResponse =
	ApiResponse<UserPermissionsInOrganization>;
export type UpdateUserPermissionsInOrganizationResponse =
	ApiResponse<UserPermissionsInOrganization>;
