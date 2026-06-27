"use client";

import { ChevronsUpDown } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/shadcn/sidebar";
import type { AdminOrganization } from "@/features/admin-organizations/types/admin-organizations";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function TeamSwitcher({
	info,
}: {
	info: {
		organization: {
			name: string;
			id: string;
			logo: React.ElementType;
		};
		organizationList: AdminOrganization[];
	};
}) {
	const { t } = useTranslation("sidebar");
	const navigate = useNavigate();
	const { isMobile } = useSidebar();

	const setOrganization = useAuthStore((state) => state.setOrganization);

	const OrganizationLogo = info.organization.logo;

	const handleOrganizationSelect = (org: { org_id: string; name: string }) => {
		setOrganization({
			name: org.name,
			id: org.org_id,
		});
		navigate(`/organizations/${org.org_id}/users`);
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<OrganizationLogo className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{info.organization.name}
								</span>
								<span className="truncate text-xs">{info.organization.id}</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							{t("organization.label2")}
						</DropdownMenuLabel>
						{info.organizationList.map((org, index) => (
							<DropdownMenuItem
								key={org.name}
								onClick={() => handleOrganizationSelect(org)}
								className={cn(
									"gap-2 p-2 flex items-start justify-between",
									org.org_id === info.organization.id &&
										"bg-sidebar-accent text-sidebar-accent-foreground"
								)}
							>
								<div className="grid flex-1 text-left text-sm leading-tight">
									{org.name}
									<span className="truncate text-xs">{org.org_id}</span>
								</div>
								<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
