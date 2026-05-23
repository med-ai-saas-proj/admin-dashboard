import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type { AdminProjectOrganization } from "@/features/admin-projects/types/admin-projects";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const projectsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_PROJECTS)}(?:\\?.*)?$`
);
const projectsPermissionsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_PROJECTS)}/permissions(?:\\?.*)?$`
);

const samplePermissions = [
	"project:read",
	"project:create",
	"project:update",
	"project:archive",
];

const sampleProjects: AdminProjectOrganization[] = Array.from(
	{ length: 24 },
	(_, i) => ({
		project_uuid: `proj_${String(i + 1).padStart(3, "0")}`,
		name: Mock.Random.pick([
			`Alpha ${i + 1}`,
			`Beta ${i + 1}`,
			`Gamma ${i + 1}`,
			`Delta ${i + 1}`,
		]),
		description: i % 3 === 0 ? `Demo project ${i + 1}` : null,
		organization_id: i % 2 === 0 ? "org_001" : "org_002",
		archived: i % 7 === 0,
	})
);

const getOrganizationIdFromUrl = (url: string) => {
	const requestUrl = new URL(url);
	return (
		requestUrl.searchParams.get("org_id") ??
		requestUrl.searchParams.get("organizationId")
	);
};

Mock.mock(projectsUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const limit = Number(requestUrl.searchParams.get("limit") ?? 10);
	const offset = Number(requestUrl.searchParams.get("offset") ?? 0);
	const orgId = getOrganizationIdFromUrl(options.url);
	const q = requestUrl.searchParams.get("q")?.toLowerCase();

	let filtered = sampleProjects;
	if (orgId) filtered = filtered.filter((p) => p.organization_id === orgId);
	if (q) {
		filtered = filtered.filter(
			(p) => p.project_uuid.includes(q) || p.name.toLowerCase().includes(q)
		);
	}

	const paged = filtered.slice(offset, offset + limit);

	return {
		success: true,
		results: paged,
		total: filtered.length,
		offset,
		limit,
	};
});

Mock.mock(projectsUrl, "post", (options: { url: string; body?: string }) => {
	const orgId = getOrganizationIdFromUrl(options.url) ?? "org_001";
	const body = options.body
		? (JSON.parse(options.body) as Record<string, unknown>)
		: {};

	const created: AdminProjectOrganization = {
		project_uuid: `proj_${String(sampleProjects.length + 1).padStart(3, "0")}`,
		name:
			typeof body.name === "string"
				? body.name
				: `Project ${sampleProjects.length + 1}`,
		description: typeof body.description === "string" ? body.description : null,
		organization_id: orgId,
		archived: false,
	};

	sampleProjects.unshift(created);

	return {
		success: true,
		results: created,
	};
});

Mock.mock(projectsPermissionsUrl, "get", () => {
	return {
		success: true,
		results: {
			permissions: samplePermissions,
		},
	};
});

// Match a single project by ID for update
const projectItemUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_PROJECTS)}/([^/]+)(?:\\?.*)?$`
);

Mock.mock(projectItemUrl, "put", (options: { url: string; body?: string }) => {
	const requestUrl = new URL(options.url);
	const parts = requestUrl.pathname.split("/");
	const projectId = parts[parts.length - 1];

	const body = options.body
		? (JSON.parse(options.body) as Record<string, unknown>)
		: {};

	const idx = sampleProjects.findIndex((p) => p.project_uuid === projectId);
	if (idx === -1) {
		return {
			success: false,
			message: "Project not found",
		};
	}

	const updated = {
		...sampleProjects[idx],
		name: typeof body.name === "string" ? body.name : sampleProjects[idx].name,
		description:
			typeof body.description === "string"
				? body.description
				: sampleProjects[idx].description,
	};

	sampleProjects[idx] = updated;

	return {
		success: true,
		results: updated,
	};
});

Mock.mock(projectItemUrl, "delete", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const parts = requestUrl.pathname.split("/");
	const projectId = parts[parts.length - 1];

	const idx = sampleProjects.findIndex((p) => p.project_uuid === projectId);
	if (idx === -1) {
		return {
			success: false,
			message: "Project not found",
		};
	}

	sampleProjects[idx] = {
		...sampleProjects[idx],
		archived: true,
	};

	return {
		success: true,
		results: {
			id: projectId,
			archived: true,
		},
	};
});
