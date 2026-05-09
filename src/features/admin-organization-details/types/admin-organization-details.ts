import type { PaginatedResponse } from "@/lib/response";

export type AdminUserOrganization = {
	id: string;
	username: string | null;
	email: string | null;
};

export type AdminOrganizationUsersResponse = PaginatedResponse<
	AdminUserOrganization[]
>;
