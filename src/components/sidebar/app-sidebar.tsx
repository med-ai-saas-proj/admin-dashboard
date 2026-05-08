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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { t } = useTranslation("sidebar");

	const { userInfo } = useAuthStore();

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
			</SidebarContent>

			<SidebarFooter>
				<LocaleSwitcher className="mx-auto" />
				{data.user && <NavUser user={data.user} />}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
