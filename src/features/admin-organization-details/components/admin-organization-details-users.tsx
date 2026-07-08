import { useState } from "react";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/shadcn/spinner";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/shadcn/table";
import { CustomPagination } from "@/components/pagination/pagination";

import { useAdminOrganizationDetailsStore } from "../store/admin-organization-details";
import { useGetAdminOrganizationUsers } from "../hooks/use-get-admin-organization-users";
import type { AdminUserOrganization } from "@/features/admin-organization-details/types/admin-organization-details";
import { useParams } from "react-router-dom";
import UpdateUserPermissionsInOrganizationDialog from "./dialogs/update-user-permissions-in-organization-dialog";
import UserProfileDialog from "@/features/general/components/dialogs/user-profile-dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { useGetAdminUserProfile } from "@/features/general/hooks/use-get-admin-user-profile";
import { itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";
import { useAuthStore } from "@/features/auth/store/auth-store";
import AddOrganizationUserDialog from "./dialogs/add-organization-user-dialog";

const UserPermissionsListInOrganization = ({
	userId,
}: {
	userId: string;
}): React.JSX.Element => {
	const { data: profileData } = useGetAdminUserProfile({
		params: { userId },
		enabled: !!userId,
	});
	const profile = profileData?.results;
	const isTop3Permissions =
		profile && profile?.permissions.organization_permissions.length <= 3;
	const permissions = isTop3Permissions
		? profile?.permissions.organization_permissions
		: profile?.permissions.organization_permissions.slice(0, 3);

	return (
		<div>
			{permissions?.map((perm) => (
				<span
					key={perm}
					className="inline-block bg-muted text-muted-foreground ring-0.5 text-xs px-2 py-1 rounded-md mr-2"
				>
					{perm}
				</span>
			))}
			{!isTop3Permissions && (
				<span className="text-xs text-muted-foreground">
					+{profile && profile?.permissions.organization_permissions.length - 3}{" "}
					more
				</span>
			)}
		</div>
	);
};

const AdminOrganizationDetailsUsers = (): React.JSX.Element => {
	const { t } = useTranslation("admin-organization");
	const { orgId } = useParams<{ orgId: string }>();
	const organizationId =
		orgId ?? useAdminOrganizationDetailsStore.getState().organizationId ?? "";

	const [inputQ, setInputQ] = useState<string>("");
	const [q, setQ] = useState<string | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [limit] = useState<number>(10);

	const offset = (currentPage - 1) * limit;

	const organizationName = useAuthStore((state) => state.organization?.name);
	const { data, isFetching, refetch, isLoading } = useGetAdminOrganizationUsers(
		{
			orgId: organizationId || "",
			limit,
			offset,
			q,
		}
	);

	const handleSearch = async () => {
		setCurrentPage(1);
		setQ(inputQ || undefined);
		await refetch();
	};

	const users: AdminUserOrganization[] = data?.results ?? [];
	const total = data?.total ?? 0;

	return (
		<div className="space-y-8">
			{organizationName && (
				<h1 className="text-2xl font-bold">
					{t("users.title")}{" "}
					{organizationName || t("details.labels.organizationName")} (
					{organizationId})
				</h1>
			)}
			<motion.div variants={itemVariants} initial="hidden" animate="visible">
				<div className="mb-4 flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<Input
							placeholder={t("users.search.placeholder")}
							value={inputQ}
							onChange={(e) => setInputQ(e.target.value)}
							className="max-w-sm"
						/>
						<Button onClick={handleSearch} variant="default" size="sm">
							{t("users.buttons.search")}
						</Button>
						{isFetching && (
							<div className="text-sm text-muted-foreground">
								{t("users.status.loading")}
							</div>
						)}
					</div>
					<AddOrganizationUserDialog />
				</div>

				<div className="border rounded-lg overflow-hidden">
					{isLoading ? (
						<div className="flex justify-center items-center py-8">
							<Spinner className="h-6 w-6" />
						</div>
					) : users.length === 0 ? (
						<div className="flex justify-center items-center py-8 text-muted-foreground">
							{q
								? t("users.table.empty.withSearch")
								: t("users.table.empty.noData")}
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("users.table.headers.number")}</TableHead>
									<TableHead>{t("users.table.headers.id")}</TableHead>
									<TableHead>{t("users.table.headers.username")}</TableHead>
									<TableHead>{t("users.table.headers.email")}</TableHead>
									<TableHead>{t("users.table.headers.permissions")}</TableHead>
									<TableHead className="text-right">
										{t("users.table.headers.actions")}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user: AdminUserOrganization, index: number) => (
									<TableRow key={user.id}>
										<TableCell>{offset + index + 1}</TableCell>
										<TableCell>{user.id}</TableCell>
										<TableCell>{user.username ?? "-"}</TableCell>
										<TableCell>{user.email ?? "-"}</TableCell>
										<TableCell>
											<UserPermissionsListInOrganization userId={user.id} />
										</TableCell>
										<TableCell className="space-x-4 text-right">
											<Tooltip>
												<TooltipTrigger asChild>
													<span>
														<UserProfileDialog userId={user.id} />
													</span>
												</TooltipTrigger>
												<TooltipContent>
													{t("users.tooltips.view_profile")}
												</TooltipContent>
											</Tooltip>

											<Tooltip>
												<TooltipTrigger asChild>
													<span>
														<UpdateUserPermissionsInOrganizationDialog
															userId={user.id}
														/>
													</span>
												</TooltipTrigger>
												<TooltipContent>
													{t("users.tooltips.update_permissions")}
												</TooltipContent>
											</Tooltip>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</motion.div>

			{/* Pagination */}
			{/* {total > limit && (
				<div className="py-4 flex justify-center">
					<CustomPagination
						currentPage={currentPage}
						limit={limit}
						totalElements={total}
						onPageChange={(p) => setCurrentPage(p)}
					/>
				</div>
			)} */}
			<div className="py-4 flex justify-center">
				<CustomPagination
					currentPage={currentPage}
					limit={limit}
					totalElements={total}
					onPageChange={(p) => setCurrentPage(p)}
				/>
			</div>
		</div>
	);
};

export default AdminOrganizationDetailsUsers;
