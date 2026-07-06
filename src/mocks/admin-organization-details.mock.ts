import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type {
	AdminOrganizationSettings,
	AdminUserOrganization,
} from "@/features/admin-organization-details/types/admin-organization-details";
import type { AdminOrganization } from "@/features/admin-organizations/types/admin-organizations";

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
		requested_at: "2024-06-01T12:00:00Z",
		delete_at: "2024-06-15T12:00:00Z",
	},
	org_002: {
		org_id: "org_002",
		name: "Beta LLC",
		owner_id: "user_002",
		requested_at: "2024-06-05T15:30:00Z",
		delete_at: "2024-06-20T15:30:00Z",
	},
};

const sampleOrganizationSettings: Record<string, AdminOrganizationSettings> = {
	org_001: {
		rate_limit: 1200,
		spending_limit: 25000,
		// extra: {
		// 	region: "us-east-1",
		// 	tier: "enterprise",
		// },
	},
	org_002: {
		rate_limit: 800,
		spending_limit: 12000,
		// extra: {
		// 	region: "eu-west-3",
		// 	tier: "business",
		// },
	},
};

const getOrganizationIdFromUrl = (url: string) => {
	const parts = url.split("/");
	return parts[parts.length - 1].split("?")[0];
};

const getOrganizationIdFromSettingsUrl = (url: string) => {
	const parts = url.split("/");
	return parts[parts.length - 2] ?? "";
};

const organizationDetailsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION)}/[^/]+(?:\\?.*)?$`
);

const organizationSettingsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION)}/[^/]+/settings(?:\\?.*)?$`
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

Mock.mock(organizationSettingsUrl, "get", (options: { url: string }) => {
	const organizationId = getOrganizationIdFromSettingsUrl(options.url);

	const data = sampleOrganizationSettings[organizationId] ?? {
		rate_limit: 500,
		spending_limit: 5000,
		extra: {
			region: "us-east-1",
			tier: "starter",
		},
	};

	return {
		success: true,
		data,
	};
});

Mock.mock(
	organizationSettingsUrl,
	"patch",
	(options: { url: string; body?: string }) => {
		const organizationId = getOrganizationIdFromSettingsUrl(options.url);
		const current = sampleOrganizationSettings[organizationId] ?? {
			rate_limit: 500,
			spending_limit: 5000,
			extra: {
				region: "us-east-1",
				tier: "starter",
			},
		};

		const payload = options.body
			? (JSON.parse(options.body) as Record<string, unknown>)
			: {};
		const hasRateLimit = Object.hasOwn(payload, "rate_limit");
		const hasSpendingLimit = Object.hasOwn(payload, "spending_limit");
		// const hasExtra = Object.hasOwn(payload, "extra");

		const next: AdminOrganizationSettings = {
			rate_limit:
				hasRateLimit && typeof payload.rate_limit === "number"
					? payload.rate_limit
					: current.rate_limit,
			spending_limit:
				hasSpendingLimit && typeof payload.spending_limit === "number"
					? payload.spending_limit
					: current.spending_limit,
			// extra:
			// 	hasExtra &&
			// 	payload.extra &&
			// 	typeof payload.extra === "object" &&
			// 	!Array.isArray(payload.extra)
			// 		? (payload.extra as Record<string, string>)
			// 		: current.extra,
		};

		sampleOrganizationSettings[organizationId] = next;

		return {
			success: true,
			results: next,
		};
	}
);

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
		results: paged,
		total: filtered.length,
		offset,
		limit,
	};
});
