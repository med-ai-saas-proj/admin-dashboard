import type { ApiResponse, PaginatedResponse } from "@/lib/response";

export type AdminApiKey = {
	api_key_uuid: string;
	project_uuid: string;
	name: string;
	description: string;
	hint: string;
	created_at: string;
	permissions: string[];
	disabled: boolean;
};

export type CreateAdminApiKey = {
	api_key_uuid: string;
	project_uuid: string;
	name: string;
	description: string;
	hint: string;
	created_at: string;
	permissions: string[];
	disabled: boolean;
	key: string;
};

export type AdminApiKeyPermissions = {
	id: string;
	name: string;
	description: string;
};

export type AdminApiKeysResponse = PaginatedResponse<AdminApiKey[]>;
export type AdminApiKeyResponse = ApiResponse<AdminApiKey>;
export type CreateAdminApiKeyResponse = ApiResponse<CreateAdminApiKey>;
export type AdminApiKeyPermissionsResponse = PaginatedResponse<
	AdminApiKeyPermissions[]
>;
