import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/shadcn/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/table";
import { CustomPagination } from "@/components/pagination/pagination";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/tooltip";
import UserProfileDialog from "@/features/general/components/dialogs/user-profile-dialog";
import { useGetAdminProjectUsers } from "../hooks/use-get-admin-project-users";
import { useAdminProjectDetailsStore } from "../store/admin-project-details";
import UpdateUserPermissionsInProjectDialog from "./dialogs/update-user-permissions-in-project-dialog";
import type { AdminProjectDetailsUsers as AdminProjectUser } from "../types/admin-project-details";
import { useGetAdminUserProfile } from "@/features/general/hooks/use-get-admin-user-profile";
import { itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";

const UserPermissionsListInProject = ({
	userId,
}: {
	userId: string;
}): React.JSX.Element => {
	const { data: profileData } = useGetAdminUserProfile({
		params: { userId },
		enabled: !!userId,
	});
	const profile = profileData?.results;
	const projectPermissions = profile?.permissions.project_permissions.flatMap(
		(perm) => perm.permissions
	);
	const isTop3Permissions =
		projectPermissions && projectPermissions.length <= 3;
	const permissions = isTop3Permissions
		? projectPermissions
		: profile?.permissions.project_permissions
				.flatMap((perm) => perm.permissions)
				.slice(0, 3);

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
					+{projectPermissions && projectPermissions.length - 3} more
				</span>
			)}
		</div>
	);
};

const AdminProjectDetailsUsersPage = (): React.JSX.Element => {
	const params = useParams<{ projectId: string }>();
	const storedProjectId = useAdminProjectDetailsStore.getState().projectId;
	const projectId = params.projectId || storedProjectId;

	const [inputQ, setInputQ] = useState<string>("");
	const [q, setQ] = useState<string | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [limit] = useState<number>(10);

	const offset = (currentPage - 1) * limit;

	const { data, isFetching, isLoading } = useGetAdminProjectUsers({
		projectId: projectId || "",
		limit,
		offset,
		q,
	});

	const { t } = useTranslation("admin-project");

	const handleSearch = () => {
		setCurrentPage(1);
		setQ(inputQ.trim() || undefined);
	};

	const users: AdminProjectUser[] = data?.results ?? [];
	const total = data?.total ?? 0;

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-bold">
				{t("users.title")} {projectId ? `(${projectId})` : ""}
			</h1>

			<motion.div variants={itemVariants} initial="hidden" animate="visible">
				<div className="mb-4 flex items-center gap-2">
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
									<TableHead>#</TableHead>
									<TableHead>ID</TableHead>
									<TableHead>{t("users.table.headers.username")}</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>{t("users.table.headers.permissions")}</TableHead>
									<TableHead className="text-right">
										{t("users.table.headers.actions", {
											defaultValue: "Actions",
										})}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user, index) => (
									<TableRow key={user.id}>
										<TableCell>{offset + index + 1}</TableCell>
										<TableCell>{user.id}</TableCell>
										<TableCell>{user.username ?? "-"}</TableCell>
										<TableCell>{user.email ?? "-"}</TableCell>
										<TableCell>
											<UserPermissionsListInProject userId={user.id} />
										</TableCell>
										<TableCell className="space-x-4 text-right">
											<Tooltip>
												<TooltipTrigger asChild>
													<span>
														<UserProfileDialog userId={user.id} />
													</span>
												</TooltipTrigger>
												<TooltipContent>
													{t("users.tooltips.view_profile", {
														defaultValue: "View profile",
													})}
												</TooltipContent>
											</Tooltip>

											<Tooltip>
												<TooltipTrigger asChild>
													<span>
														<UpdateUserPermissionsInProjectDialog
															userId={user.id}
														/>
													</span>
												</TooltipTrigger>
												<TooltipContent>
													{t("users.tooltips.update_permissions", {
														defaultValue: "Update permissions",
													})}
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

			{/* {total > limit && (
				<div className="py-4 flex justify-center">
					<CustomPagination
						currentPage={currentPage}
						limit={limit}
						totalElements={total}
						onPageChange={(page) => setCurrentPage(page)}
					/>
				</div>
			)} */}
			<div className="py-4 flex justify-center">
				<CustomPagination
					currentPage={currentPage}
					limit={limit}
					totalElements={total}
					onPageChange={(page) => setCurrentPage(page)}
				/>
			</div>
		</div>
	);
};

export default AdminProjectDetailsUsersPage;
