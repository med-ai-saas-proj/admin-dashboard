import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type {
	AdminApiKey,
	AdminApiKeyPermissions,
} from "@/features/admin-api-keys/types/admin-api-keys";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const apiKeysUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_API_KEYS)}(?:[?].*)?$`
);

const apiKeysPermissionsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_API_KEYS)}/permissions(?:[?].*)?$`
);

const samplePermissions: AdminApiKeyPermissions[] = [
	{
		id: "api_read",
		name: "Read API",
		description: "Read access to API endpoints",
	},
	{
		id: "api_write",
		name: "Write API",
		description: "Write access to API endpoints",
	},
	{
		id: "api_delete",
		name: "Delete API",
		description: "Delete access to API endpoints",
	},
	{
		id: "admin_read",
		name: "Admin Read",
		description: "Read admin resources",
	},
	{
		id: "admin_write",
		name: "Admin Write",
		description: "Write admin resources",
	},
];

const sampleApiKeys: Record<string, AdminApiKey[]> = {
	proj_001: [
		{
			api_key_uuid: "key_001",
			project_uuid: "proj_001",
			name: "Development Key",
			description: "For development environment",
			hint: "sk_dev_****",
			created_at: "2024-01-15T10:30:00Z",
			permissions: ["api_read", "api_write"],
			disabled: false,
		},
		{
			api_key_uuid: "key_002",
			project_uuid: "proj_001",
			name: "Production Key",
			description: "For production environment",
			hint: "sk_prod_****",
			created_at: "2024-01-20T14:45:00Z",
			permissions: ["api_read"],
			disabled: false,
		},
	],
	proj_002: [
		{
			api_key_uuid: "key_003",
			project_uuid: "proj_002",
			name: "Testing Key",
			description: "For testing",
			hint: "sk_test_****",
			created_at: "2024-02-01T08:15:00Z",
			permissions: ["api_read", "api_write", "api_delete"],
			disabled: true,
		},
	],
};

// Permissions endpoint
Mock.mock(apiKeysPermissionsUrl, "get", () => {
	return {
		success: true,
		data: samplePermissions,
	};
});

// API Keys list and create endpoint
Mock.mock(apiKeysUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const projectId = requestUrl.searchParams.get("project_id");

	const keys = projectId ? (sampleApiKeys[projectId] ?? []) : [];

	return {
		success: true,
		data: keys,
	};
});

Mock.mock(apiKeysUrl, "post", (options: { url: string; body?: string }) => {
	const requestUrl = new URL(options.url);
	const projectId = requestUrl.searchParams.get("project_id");
	const body = options.body
		? (JSON.parse(options.body) as Record<string, unknown>)
		: {};

	if (!projectId) {
		return {
			success: false,
			message: "project_id is required",
		};
	}

	const newKey: AdminApiKey = {
		api_key_uuid: `key_${Date.now()}`,
		project_uuid: projectId,
		name: typeof body.name === "string" ? body.name : "New API Key",
		description: typeof body.description === "string" ? body.description : "",
		hint: "sk_****",
		created_at: new Date().toISOString(),
		permissions: Array.isArray(body.permissions)
			? (body.permissions as string[])
			: [],
		disabled: false,
	};

	// Add to sample data
	if (!sampleApiKeys[projectId]) {
		sampleApiKeys[projectId] = [];
	}
	sampleApiKeys[projectId].unshift(newKey);

	return {
		success: true,
		data: newKey,
	};
});
