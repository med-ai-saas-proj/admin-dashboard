import type { ApiResponse, PaginatedResponse } from "@/lib/response";

export type AdminOrganization = {
	org_id: string;
	name: string;
	owner_id: string | null;
};

export type AdminOrganizationDelete = {
	id: string;
	requested_at: string;
	cancel_before: string;
};

export type AdminOrganizationPermissions = {
	permissions: string[];
};

export type AdminOrganizationsListResponse = PaginatedResponse<
	AdminOrganization[]
>;
export type AdminOrganizationDetailsResponse = ApiResponse<AdminOrganization>;
export type AdminOrganizationsResponse = ApiResponse<AdminOrganization[]>;
export type AdminOrganizationDeleteResponse =
	ApiResponse<AdminOrganizationDelete>;
export type AdminOrganizationPermissionsResponse =
	ApiResponse<AdminOrganizationPermissions>;
