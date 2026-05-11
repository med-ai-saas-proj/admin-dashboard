import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type {
	AdminProjectDetailsSettings,
	AdminProjectDetailsUsers,
} from "@/features/admin-project-details/types/admin-project-details";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const projectUsersUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_PROJECTS)}/[^/]+/users(?:\\?.*)?$`
);

const projectSettingsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_PROJECTS)}/[^/]+/settings(?:\\?.*)?$`
);

const sampleProjectUsers: AdminProjectDetailsUsers[] = Array.from(
	{ length: 30 },
	(_, i) => ({
		id: `user_${String(i + 1).padStart(3, "0")}`,
		username: `project_user${i + 1}`,
		email: `project_user${i + 1}@example.com`,
	})
);

const sampleProjectSettings: Record<string, AdminProjectDetailsSettings> = {
	project_001: {
		rate_limit: 1500,
		spending_limit: 30000,
	},
	project_002: {
		rate_limit: 900,
		spending_limit: 12000,
	},
};

const getProjectIdFromSettingsUrl = (url: string) => {
	const parts = url.split("/");
	return parts[parts.length - 2] ?? "";
};

Mock.mock(projectSettingsUrl, "get", (options: { url: string }) => {
	const projectId = getProjectIdFromSettingsUrl(options.url);

	const data = sampleProjectSettings[projectId] ?? {
		rate_limit: 500,
		spending_limit: 5000,
	};

	return {
		success: true,
		data,
	};
});

Mock.mock(
	projectSettingsUrl,
	"put",
	(options: { url: string; body?: string }) => {
		const projectId = getProjectIdFromSettingsUrl(options.url);
		const current = sampleProjectSettings[projectId] ?? {
			rate_limit: 500,
			spending_limit: 5000,
		};

		const payload = options.body
			? (JSON.parse(options.body) as Record<string, unknown>)
			: {};
		const hasRateLimit = Object.hasOwn(payload, "rate_limit");
		const hasSpendingLimit = Object.hasOwn(payload, "spending_limit");

		const next: AdminProjectDetailsSettings = {
			rate_limit:
				hasRateLimit && typeof payload.rate_limit === "number"
					? payload.rate_limit
					: current.rate_limit,
			spending_limit:
				hasSpendingLimit && typeof payload.spending_limit === "number"
					? payload.spending_limit
					: current.spending_limit,
		};

		sampleProjectSettings[projectId] = next;

		return {
			success: true,
			data: next,
		};
	}
);

Mock.mock(projectUsersUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const limit = Number(requestUrl.searchParams.get("limit") ?? 10);
	const offset = Number(requestUrl.searchParams.get("offset") ?? 0);
	const q = requestUrl.searchParams.get("q")?.toLowerCase();

	const filtered = q
		? sampleProjectUsers.filter(
				(user) =>
					user.id.toLowerCase().includes(q) ||
					user.username?.toLowerCase().includes(q) ||
					user.email?.toLowerCase().includes(q)
			)
		: sampleProjectUsers;

	const paged = filtered.slice(offset, offset + limit);

	return {
		success: true,
		data: paged,
		total: filtered.length,
		offset,
		limit,
	};
});
