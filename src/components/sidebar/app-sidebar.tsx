"use client";

import { CreditCard, GalleryVerticalEnd } from "lucide-react";
import type * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/shadcn/sidebar";
import { LocaleSwitcher } from "@/components/sidebar/locale-switcher";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useTranslation } from "react-i18next";
import { useAdminOrganizationDetailsStore } from "@/features/admin-organization-details/store/admin-organization-details";
import { useParams } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { t } = useTranslation("sidebar");
	const params = useParams();

	const { userInfo } = useAuthStore();

	const storedOrganizationId = useAdminOrganizationDetailsStore(
		(state) => state.organizationId
	);
	const organizationId = params.orgId || storedOrganizationId;

	const data = {
		teams: [
			{
				name: "Acme Inc",
				logo: GalleryVerticalEnd,
				plan: "Enterprise",
			},
		],
		user: userInfo,
		dashboard: [
			{
				name: t("dashboard.billing.title"),
				url: "/dashboard/billing",
				icon: CreditCard,
			},
		],
		adminDashboard: [
			{
				name: t("adminDashboard.admin.title"),
				url: "/admin-dashboard/admin",
				icon: CreditCard,
			},
			{
				name: t("adminDashboard.users.title"),
				url: "/admin-dashboard/users",
				icon: CreditCard,
			},
		],
		management: [
			{
				name: t("management.organizations.title"),
				url: "/management/organizations",
				icon: CreditCard,
			},
			{
				name: t("management.billing.title"),
				url: "/management/billing",
				icon: CreditCard,
			},
		],
		organization: [
			{
				name: t("organization.users.title"),
				url: `/organizations/${organizationId}/users`,
				icon: CreditCard,
				disableActive: !organizationId,
			},
			{
				name: t("organization.projects.title"),
				url: `/organizations/${organizationId}/projects`,
				icon: CreditCard,
			},
			{
				name: t("organization.settings.title"),
				url: `/organizations/${organizationId}/settings`,
				icon: CreditCard,
				disableActive: !organizationId,
			},
		],
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavProjects projects={data.dashboard} label={t("dashboard.label")} />
				<NavProjects
					projects={data.adminDashboard}
					label={t("adminDashboard.label")}
				/>
				<NavProjects projects={data.management} label={t("management.label")} />
				{organizationId && (
					<NavProjects
						projects={data.organization}
						label={t("organization.label")}
					/>
				)}
			</SidebarContent>

			<SidebarFooter>
				<LocaleSwitcher className="mx-auto" />
				{data.user && <NavUser user={data.user} />}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
