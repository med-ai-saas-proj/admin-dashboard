import type { ApiResponse, PaginatedResponse } from "@/lib/response";

export type AdminMe = {
	id: string;
	username: string | null;
	email: string | null;
};

export type AdminSummary = {
	organizations: number;
	projects: number;
	api_keys: number;
	users: number;
};

export type UserInfo = {
	id: string;
	username: string | null;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	enabled: true;
	email_verified: true;
};

export type UserOrganizationInfo = {
	id: string;
	name: string | null;
	alias: string | null;
};

export type UserProfileInfo = {
	id: string;
	username: string | null;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	enabled: true;
	email_verified: true;
	organizations: [
		{
			id: string;
			name: string | null;
			alias: string | null;
		},
	];
	permissions: {
		organization_permissions: string[];
		effective_organization_permissions: string[];
		project_permissions: [
			{
				id: string;
				permissions: string[];
				effective_permissions: string[];
			},
		];
	};
};

export type UserPermissions = {
	organization_permissions: string[];
	project_permissions: [
		{
			project_id: string;
			permissions: string[];
		},
	];
};

export type UserListResponse = PaginatedResponse<UserInfo>;
export type UserOrganizationListResponse = ApiResponse<UserOrganizationInfo[]>;
export type UserProfileResponse = ApiResponse<UserProfileInfo>;
export type UserPermissionsResponse = ApiResponse<UserPermissions>;
