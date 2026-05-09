import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type { AdminOrganization } from "@/features/admin-organizations/types/admin-organizations";
import type { AdminUserOrganization } from "@/features/admin-organization-details/types/admin-organization-details";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// --- Organization users (paginated)
const organizationUsersUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION)}/[^/]+/users(?:\\?.*)?$`
);

const sampleOrganizationUsers: AdminUserOrganization[] = Array.from(
	{ length: 25 },
	(_, i) => ({
		id: `user_${String(i + 1).padStart(3, "0")}`,
		username: `org_user${i + 1}`,
		email: `org_user${i + 1}@example.com`,
	})
);

const sampleOrganizations: Record<string, AdminOrganization> = {
	org_001: {
		org_id: "org_001",
		name: "Acme Corp",
		owner_id: "user_001",
	},
	org_002: {
		org_id: "org_002",
		name: "Beta LLC",
		owner_id: "user_002",
	},
};

const getOrganizationIdFromUrl = (url: string) => {
	const parts = url.split("/");
	return parts[parts.length - 1].split("?")[0];
};

const organizationDetailsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION)}/[^/]+(?:\\?.*)?$`
);

Mock.mock(organizationDetailsUrl, "get", (options: { url: string }) => {
	const organizationId = getOrganizationIdFromUrl(options.url);

	const data = sampleOrganizations[organizationId] ?? {
		org_id: organizationId,
		name: `Organization ${organizationId}`,
		owner_id: null,
	};

	return {
		success: true,
		data,
	};
});

Mock.mock(organizationUsersUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const limit = Number(requestUrl.searchParams.get("limit") ?? 10);
	const offset = Number(requestUrl.searchParams.get("offset") ?? 0);
	const q = requestUrl.searchParams.get("q")?.toLowerCase();

	const filtered = q
		? sampleOrganizationUsers.filter(
				(u) =>
					u.id.toLowerCase().includes(q) ||
					u.username?.toLowerCase().includes(q) ||
					u.email?.toLowerCase().includes(q)
			)
		: sampleOrganizationUsers;

	const paged = filtered.slice(offset, offset + limit);

	return {
		success: true,
		data: paged,
		total: filtered.length,
		offset,
		limit,
	};
});
