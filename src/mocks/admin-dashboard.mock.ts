import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type { AdminMe, AdminSummary } from "@/features/general/types/admin";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const adminMeUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.ADMIN_DASHBOARD.ADMIN)}/me(?:\\?.*)?$`
);

const adminSummaryUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.ADMIN_DASHBOARD.ADMIN)}/summary(?:\\?.*)?$`
);

const adminMe: AdminMe = {
	id: "admin_001",
	username: "admin.user",
	email: "admin.user@example.com",
};

const adminSummary: AdminSummary = {
	organizations: 18,
	projects: 42,
	api_keys: 27,
	users: 314,
};

Mock.mock(adminMeUrl, "get", () => {
	return adminMe;
});

Mock.mock(adminSummaryUrl, "get", () => {
	return adminSummary;
});

// --- Users list (paginated)
const usersUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.ADMIN_DASHBOARD.ADMIN)}/users(?:\\?.*)?$`
);

const sampleUsers = Array.from({ length: 12 }, (_, i) => ({
	id: `user_${String(i + 1).padStart(3, "0")}`,
	username: `user${i + 1}`,
	email: `user${i + 1}@example.com`,
	first_name: `First${i + 1}`,
	last_name: `Last${i + 1}`,
	enabled: true,
	email_verified: true,
}));

Mock.mock(usersUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const limit = Number(requestUrl.searchParams.get("limit") ?? 10);
	const offset = Number(requestUrl.searchParams.get("offset") ?? 0);
	const q = requestUrl.searchParams.get("q")?.toLowerCase();

	const filtered = q
		? sampleUsers.filter(
				(u) => u.username?.includes(q) || u.email?.toLowerCase().includes(q)
			)
		: sampleUsers;

	const paged = filtered.slice(offset, offset + limit);

	return {
		success: true,
		data: paged,
		total: filtered.length,
		offset,
		limit,
	};
});

// --- User organizations
const userOrgsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.ADMIN_DASHBOARD.ADMIN)}/user-organizations(?:\\?.*)?$`
);

const sampleOrgs = [
	{ id: "org_001", name: "Acme Corp", alias: "acme" },
	{ id: "org_002", name: "Beta LLC", alias: "beta" },
];

Mock.mock(userOrgsUrl, "get", () => {
	// echo back organizations for the provided userId (if any)
	return {
		success: true,
		data: sampleOrgs,
	};
});

// --- User profile
const userProfileUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.ADMIN_DASHBOARD.ADMIN)}/user-profiles/[^/]+(?:\\?.*)?$`
);

Mock.mock(userProfileUrl, "get", (options: { url: string }) => {
	const parts = options.url.split("/");
	const userId = parts[parts.length - 1].split("?")[0];

	const profile = {
		id: userId,
		username: `profile_${userId}`,
		email: `${userId}@example.com`,
		first_name: "First",
		last_name: "Last",
		enabled: true,
		email_verified: true,
		organizations: sampleOrgs,
		permissions: {
			organization_permissions: ["ORG_READ", "ORG_WRITE"],
			effective_organization_permissions: ["ORG_READ"],
			project_permissions: [
				{
					id: "proj_001",
					permissions: ["PROJECT_READ"],
					effective_permissions: ["PROJECT_READ"],
				},
			],
		},
	};

	return {
		success: true,
		data: profile,
	};
});

// --- User permissions
const userPermissionsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.ADMIN_DASHBOARD.ADMIN)}/user-permissions/[^/]+(?:\\?.*)?$`
);

Mock.mock(userPermissionsUrl, "get", () => {
	// userId present in URL but not required for the mock response
	const permissions = {
		organization_permissions: ["ORG_READ", "ORG_WRITE"],
		project_permissions: [
			{
				project_id: "proj_001",
				permissions: ["PROJECT_READ", "PROJECT_WRITE"],
			},
		],
	};

	return {
		success: true,
		data: permissions,
	};
});
