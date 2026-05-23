import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";
import type {
	AdminOrganization,
	AdminOrganizationDelete,
	AdminOrganizationPermissions,
} from "@/features/admin-organizations/types/admin-organizations";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const orgsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION)}(?:\\?.*)?$`
);

const orgDetailUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION)}/[^/]+(?:\\?.*)?$`
);

const permissionsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.ADMIN_ORGANIZATION)}/permissions(?:\\?.*)?$`
);

const sampleOrgs: AdminOrganization[] = Array.from({ length: 12 }, (_, i) => ({
	org_id: `org_${String(i + 1).padStart(3, "0")}`,
	name: Mock.Random.pick([`Acme ${i + 1}`, `Beta ${i + 1}`, `Gamma ${i + 1}`]),
	owner_id: Mock.Random.bool()
		? `owner_${String(i + 1).padStart(3, "0")}`
		: null,
}));

const samplePermissions: AdminOrganizationPermissions = {
	permissions: [
		"ORG_READ",
		"ORG_WRITE",
		"ORG_DELETE",
		"SETTINGS_READ",
		"SETTINGS_WRITE",
		"USERS_READ",
		"USERS_MANAGE",
	],
};

// Register permissions handler early so `/organizations/permissions` does
// not accidentally match the org detail route (which would return an array).
Mock.mock(permissionsUrl, "get", () => {
	return {
		success: true,
		results: samplePermissions,
	};
});

Mock.mock(orgsUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const limit = Number(requestUrl.searchParams.get("limit") ?? 10);
	const offset = Number(requestUrl.searchParams.get("offset") ?? 0);
	const q = requestUrl.searchParams.get("q")?.toLowerCase();

	const filtered = q
		? sampleOrgs.filter(
				(o) =>
					o.org_id.toLowerCase().includes(q) ||
					o.name.toLowerCase().includes(q) ||
					(o.owner_id?.toLowerCase().includes(q) ?? false)
			)
		: sampleOrgs;

	const paged = filtered.slice(offset, offset + limit);

	return {
		success: true,
		results: paged,
		total: filtered.length,
		offset,
		limit,
	};
});

Mock.mock(orgDetailUrl, "get", (options: { url: string }) => {
	const parts = options.url.split("/");
	const id = parts[parts.length - 1].split("?")[0];
	const org = sampleOrgs.find((o) => o.org_id === id) || null;

	return {
		success: true,
		results: org ? [org] : [],
	};
});

Mock.mock(orgsUrl, "post", (options: { body?: string }) => {
	const body = options.body ? JSON.parse(options.body) : {};
	const nextId = `org_${String(sampleOrgs.length + 1).padStart(3, "0")}`;
	const newOrg: AdminOrganization = {
		org_id: nextId,
		name: body.name ?? `New Org ${nextId}`,
		owner_id: body.owner_id ?? null,
	};

	sampleOrgs.unshift(newOrg);

	return {
		success: true,
		results: [newOrg],
	};
});

Mock.mock(orgDetailUrl, "put", (options: { url: string; body?: string }) => {
	const parts = options.url.split("/");
	const id = parts[parts.length - 1].split("?")[0];
	const body = options.body ? JSON.parse(options.body) : {};

	const idx = sampleOrgs.findIndex((o) => o.org_id === id);
	if (idx >= 0) {
		sampleOrgs[idx] = {
			...sampleOrgs[idx],
			name: body.name ?? sampleOrgs[idx].name,
		};
		return {
			success: true,
			results: [sampleOrgs[idx]],
		};
	}

	return {
		success: false,
		results: [],
	};
});

Mock.mock(orgDetailUrl, "delete", (options: { url: string }) => {
	const parts = options.url.split("/");
	const id = parts[parts.length - 1].split("?")[0];

	const idx = sampleOrgs.findIndex((o) => o.org_id === id);
	if (idx >= 0) sampleOrgs.splice(idx, 1);

	const now = new Date();
	const deleteResponse: AdminOrganizationDelete = {
		id,
		requested_at: now.toISOString(),
		cancel_before: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
	};

	return {
		success: true,
		results: deleteResponse,
	};
});

Mock.mock(permissionsUrl, "get", () => {
	return {
		success: true,
		results: samplePermissions,
	};
});
