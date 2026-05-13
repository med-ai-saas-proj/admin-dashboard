import type { ApiResponse } from "@/lib/response";

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

export type AdminApiKeyPermissions = {
	id: string;
	name: string;
	description: string;
};

export type AdminApiKeysResponse = ApiResponse<AdminApiKey[]>;
export type AdminApiKeyResponse = ApiResponse<AdminApiKey>;
export type AdminApiKeyPermissionsResponse = ApiResponse<
	AdminApiKeyPermissions[]
>;
