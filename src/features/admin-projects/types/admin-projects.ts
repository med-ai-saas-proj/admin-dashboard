import type { ApiResponse, PaginatedResponse } from "@/lib/response";

export type AdminProjectOrganization = {
	project_uuid: string;
	name: string;
	description: string | null;
	organization_id: string;
	archived: boolean;
};

export type AdminProjectsPermissions = {
	permissions: string[];
};

export type AdminProjectsOrganizationResponse = PaginatedResponse<
	AdminProjectOrganization[]
>;
export type CreateAdminProjectOrganizationResponse =
	ApiResponse<AdminProjectOrganization>;
export type AdminProjectsPermissionsResponse =
	ApiResponse<AdminProjectsPermissions>;
