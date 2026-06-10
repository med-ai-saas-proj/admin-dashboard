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
		{
			api_key_uuid: "key_004",
			project_uuid: "proj_001",
			name: "Staging Key",
			description: "For staging environment",
			hint: "sk_stage_****",
			created_at: "2024-01-25T09:10:00Z",
			permissions: ["api_read", "api_write"],
			disabled: false,
		},
		{
			api_key_uuid: "key_005",
			project_uuid: "proj_001",
			name: "Automation Key",
			description: "Used by CI jobs",
			hint: "sk_ci_****",
			created_at: "2024-01-28T07:20:00Z",
			permissions: ["api_read", "admin_read"],
			disabled: true,
		},
		{
			api_key_uuid: "key_006",
			project_uuid: "proj_001",
			name: "Support Key",
			description: "Limited support access",
			hint: "sk_support_****",
			created_at: "2024-02-02T13:05:00Z",
			permissions: ["api_read"],
			disabled: false,
		},
		{
			api_key_uuid: "key_007",
			project_uuid: "proj_001",
			name: "Legacy Key",
			description: "Old key kept for compatibility",
			hint: "sk_legacy_****",
			created_at: "2024-02-10T17:45:00Z",
			permissions: ["api_read", "api_delete"],
			disabled: true,
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
		{
			api_key_uuid: "key_008",
			project_uuid: "proj_002",
			name: "QA Key",
			description: "For quality assurance",
			hint: "sk_qa_****",
			created_at: "2024-02-04T11:30:00Z",
			permissions: ["api_read"],
			disabled: false,
		},
	],
};

// Permissions endpoint
Mock.mock(apiKeysPermissionsUrl, "get", () => {
	return {
		success: true,
		results: samplePermissions,
	};
});

// API Keys list and create endpoint
Mock.mock(apiKeysUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const projectId = requestUrl.searchParams.get("project_id");

	const keys = projectId ? (sampleApiKeys[projectId] ?? []) : [];

	return {
		success: true,
		results: keys,
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
		results: newKey,
	};
});

// Update API key
const apiKeyItemUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_API_KEYS)}/([^/]+)(?:[?].*)?$`
);

Mock.mock(apiKeyItemUrl, "put", (options: { url: string; body?: string }) => {
	const match = options.url.match(apiKeyItemUrl);
	const apiKeyId = match?.[1] ? match[1] : null;
	const body = options.body
		? (JSON.parse(options.body) as Record<string, unknown>)
		: {};

	if (!apiKeyId) {
		return { success: false, message: "api key id is required" };
	}

	let updated: AdminApiKey | null = null;

	// Search across all projects and update the matching key
	Object.keys(sampleApiKeys).forEach((proj) => {
		sampleApiKeys[proj] = sampleApiKeys[proj].map((k) => {
			if (k.api_key_uuid === apiKeyId) {
				const newK = {
					...k,
					name: typeof body.name === "string" ? body.name : k.name,
					description:
						typeof body.description === "string"
							? body.description
							: k.description,
					permissions: Array.isArray(body.permissions)
						? (body.permissions as string[])
						: k.permissions,
					disabled:
						typeof body.disabled === "boolean" ? body.disabled : k.disabled,
				};
				updated = newK;
				return newK;
			}
			return k;
		});
	});

	if (!updated) {
		return { success: false, message: "api key not found" };
	}

	return { success: true, results: updated };
});

// Delete API key
Mock.mock(apiKeyItemUrl, "delete", (options: { url: string }) => {
	const match = options.url.match(apiKeyItemUrl);
	const apiKeyId = match?.[1] ? match[1] : null;

	if (!apiKeyId) {
		return { success: false, message: "api key id is required" };
	}

	let removed: AdminApiKey | null = null;

	Object.keys(sampleApiKeys).forEach((proj) => {
		const before = sampleApiKeys[proj];
		const after = before.filter((k) => {
			if (k.api_key_uuid === apiKeyId) {
				removed = k;
				return false;
			}
			return true;
		});
		sampleApiKeys[proj] = after;
	});

	if (!removed) {
		return { success: false, message: "api key not found" };
	}

	return { success: true, results: null };
});
