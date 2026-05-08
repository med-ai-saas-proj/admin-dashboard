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
