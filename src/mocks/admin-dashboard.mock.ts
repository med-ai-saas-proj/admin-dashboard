import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type {
	AdminMe,
	AdminSummary,
	UpdateAdminUserPermissionsRequest,
	UserProfileInfo,
} from "@/features/general/types/admin";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const adminMeUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN)}/me(?:\\?.*)?$`
);

const adminSummaryUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN)}/summary(?:\\?.*)?$`
);

const adminMe: AdminMe = {
	user_id: "admin_001",
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
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN)}/users(?:\\?.*)?$`
);

const sampleUsers = Array.from({ length: 12 }, (_, i) => ({
	id: `user_${String(i + 1).padStart(3, "0")}`,
	username: `user${i + 1}`,
	email: `user${i + 1}@example.com`,
	first_name: `First${i + 1}`,
	last_name: `Last${i + 1}`,
	enabled: i % 2 === 0,
	email_verified: i % 3 !== 0,
}));

Mock.mock(usersUrl, "get", (options: { url: string }) => {
	// `options.url` may be a relative path; provide a base to avoid URL constructor errors
	const requestUrl = new URL(options.url, "http://localhost");
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
		results: paged,
		total: filtered.length,
		offset,
		limit,
	};
});

// --- User organizations
const userOrgsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN)}/user-organizations(?:\\?.*)?$`
);

const sampleOrgs = [
	{ org_id: "org_001", name: "Acme Corp", alias: "acme" },
	{ org_id: "org_002", name: "Beta LLC", alias: "beta" },
];

Mock.mock(userOrgsUrl, "get", () => {
	// echo back organizations for the provided userId (if any)
	return {
		success: true,
		results: sampleOrgs,
	};
});

// --- User profile
const userProfileUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN)}/user-profiles/[^/]+(?:\\?.*)?$`
);

const createMockProfile = (userId: string): UserProfileInfo => ({
	user_id: userId,
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
				project_uuid: "proj_001",
				permissions: ["PROJECT_READ"],
				effective_permissions: ["PROJECT_READ"],
			},
		],
	},
});

const sampleUserProfiles: Record<string, UserProfileInfo> = {
	user_001: createMockProfile("user_001"),
	user_002: createMockProfile("user_002"),
};

Mock.mock(userProfileUrl, "get", (options: { url: string }) => {
	const parts = options.url.split("/");
	const userId = parts[parts.length - 1].split("?")[0];

	const profile = sampleUserProfiles[userId] ?? createMockProfile(userId);
	sampleUserProfiles[userId] = profile;

	return {
		success: true,
		results: profile,
	};
});

// --- User permissions
const userPermissionsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN)}/users/[^/]+/permissions(?:\\?.*)?$`
);

const getUserIdFromUrl = (url: string) => {
	const parts = url.split("/");
	// URL pattern: .../users/{userId}/permissions
	// userId is the segment before the last one ("permissions")
	return parts[parts.length - 2].split("?")[0];
};

Mock.mock(userPermissionsUrl, "get", (options: { url: string }) => {
	const userId = getUserIdFromUrl(options.url);
	const profile = sampleUserProfiles[userId] ?? createMockProfile(userId);
	sampleUserProfiles[userId] = profile;

	return {
		success: true,
		results: profile,
	};
});

Mock.mock(
	userPermissionsUrl,
	"put",
	(options: { url: string; body?: string }) => {
		const userId = getUserIdFromUrl(options.url);
		const permissions = options.body
			? (JSON.parse(options.body) as UpdateAdminUserPermissionsRequest)
			: {
					organization_permissions: [],
					project_permissions: [],
				};

		const previousProfile =
			sampleUserProfiles[userId] ?? createMockProfile(userId);
		const updatedProfile: UserProfileInfo = {
			...previousProfile,
			permissions: {
				...previousProfile.permissions,
				organization_permissions: permissions.organization_permissions,
				effective_organization_permissions:
					permissions.organization_permissions,
				project_permissions: permissions.project_permissions.map(
					(projectPermission) => ({
						project_uuid: projectPermission.project_uuid,
						permissions: projectPermission.permissions,
						effective_permissions: projectPermission.permissions,
					})
				),
			},
		};

		sampleUserProfiles[userId] = updatedProfile;

		return {
			success: true,
			results: updatedProfile,
		};
	}
);

Mock.mock(userPermissionsUrl, "delete", (options: { url: string }) => {
	const userId = getUserIdFromUrl(options.url);
	const previousProfile =
		sampleUserProfiles[userId] ?? createMockProfile(userId);
	sampleUserProfiles[userId] = {
		...previousProfile,
		permissions: {
			organization_permissions: [],
			effective_organization_permissions: [],
			project_permissions: [],
		},
	};

	return {
		success: true,
	};
});
