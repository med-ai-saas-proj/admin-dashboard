import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Archive, Eye, RotateCcw, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { useTranslation } from "react-i18next";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/table";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Input } from "@/components/shadcn/input";
import { Spinner } from "@/components/shadcn/spinner";
import { useGetAdminProjectsOrganization } from "@/features/admin-projects/hooks/use-get-admin-projects-organization";
import { useAdminOrganizationDetailsStore } from "@/features/admin-organization-details/store/admin-organization-details";
import type { AdminProjectOrganization } from "@/features/admin-projects/types/admin-projects";
import { CustomPagination } from "@/components/pagination/pagination";
import {
	CreateAdminProjectDialog,
	ArchiveAdminProjectDialog,
	ViewDetailsAdminProjectDialog,
	DeleteAdminProjectDialog,
} from "./dialogs";
import { itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";

const AdminProjectsOrganization = (): React.JSX.Element => {
	const { t } = useTranslation("admin-project");
	const params = useParams<{ orgId: string }>();
	const orgId = useAdminOrganizationDetailsStore.getState().organizationId;
	const organizationId = orgId ?? params.orgId ?? "";

	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "archived" | "active"
	>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [limit] = useState(10);
	const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
	const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedProject, setSelectedProject] =
		useState<AdminProjectOrganization | null>(null);

	const offset = (currentPage - 1) * limit;

	const { data, isLoading, isFetching } = useGetAdminProjectsOrganization({
		organizationId,
		limit,
		offset,
		q: searchTerm || undefined,
	});

	const projects = data?.results ?? [];
	const totalElements = data?.total ?? 0;

	const filteredProjects = useMemo(() => {
		return projects.filter((project) => {
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "archived" && project.archived) ||
				(statusFilter === "active" && !project.archived);

			return matchesStatus;
		});
	}, [projects, statusFilter]);

	const handleSearch = () => {
		setCurrentPage(1);
		setSearchTerm(searchInput.trim());
	};

	const handleViewDetails = (project: AdminProjectOrganization) => {
		setSelectedProject(project);
		setViewDetailsDialogOpen(true);
	};

	const handleOpenArchive = (project: AdminProjectOrganization) => {
		setSelectedProject(project);
		setArchiveDialogOpen(true);
	};

	const handleOpenDelete = (project: AdminProjectOrganization) => {
		setSelectedProject(project);
		setDeleteDialogOpen(true);
	};

	return (
		<motion.div variants={itemVariants} initial="hidden" animate="visible">
			<div className="space-y-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<form
						onSubmit={(event) => {
							event.preventDefault();
							handleSearch();
						}}
						className="flex flex-1 flex-col gap-3 sm:flex-row"
					>
						<div className="flex flex-1 items-center gap-2 max-w-xl">
							<Input
								value={searchInput}
								onChange={(event) => setSearchInput(event.target.value)}
								placeholder={t("overview.search.placeholder")}
								className="min-w-0"
							/>
							<Button type="submit" variant="default">
								<Search className="size-4" />
								{t("overview.buttons.search")}
							</Button>
						</div>

						<Select
							value={statusFilter}
							onValueChange={(value) =>
								setStatusFilter(value as typeof statusFilter)
							}
						>
							<SelectTrigger className="w-full sm:w-[220px]">
								<SelectValue placeholder={t("overview.filter.label")} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									{t("overview.filter.options.all")}
								</SelectItem>
								<SelectItem value="active">
									{t("overview.filter.options.active")}
								</SelectItem>
								<SelectItem value="archived">
									{t("overview.filter.options.archived")}
								</SelectItem>
							</SelectContent>
						</Select>
					</form>

					<CreateAdminProjectDialog organizationId={organizationId} />
				</div>

				<div className="rounded-lg border bg-background shadow-sm overflow-hidden">
					<div className="max-h-[70vh] overflow-auto">
						{isLoading ? (
							<div className="flex items-center justify-center py-16">
								<Spinner className="size-6" />
							</div>
						) : filteredProjects.length === 0 ? (
							<div className="flex items-center justify-center py-16">
								<div className="text-sm text-muted-foreground">
									{isFetching
										? t("overview.loading")
										: t("overview.table.empty.noData")}
								</div>
							</div>
						) : (
							<Table>
								<TableHeader className="sticky top-0 z-10 bg-background">
									<TableRow>
										<TableHead>{t("overview.table.headers.uuid")}</TableHead>
										<TableHead>{t("overview.table.headers.name")}</TableHead>
										<TableHead>
											{t("overview.table.headers.description")}
										</TableHead>
										<TableHead>
											{t("overview.table.headers.organizationId")}
										</TableHead>
										<TableHead>
											{t("overview.table.headers.archived")}
										</TableHead>
										<TableHead className="text-right">
											{t("overview.table.headers.actions")}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredProjects.map((project) => (
										<TableRow key={project.project_uuid}>
											<TableCell>{project.project_uuid}</TableCell>
											<TableCell>{project.name}</TableCell>
											<TableCell>{project.description ?? "-"}</TableCell>
											<TableCell>{project.organization_id}</TableCell>
											<TableCell>
												{project.archived
													? t("overview.status.archived")
													: t("overview.status.active")}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleViewDetails(project)}
															>
																<Eye className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															{t("overview.actions.view")}
														</TooltipContent>
													</Tooltip>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleOpenArchive(project)}
															>
																{project.archived ? (
																	<RotateCcw className="h-4 w-4" />
																) : (
																	<Archive className="h-4 w-4" />
																)}
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															{project.archived
																? t("overview.actions.restore")
																: t("overview.actions.archive")}
														</TooltipContent>
													</Tooltip>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleOpenDelete(project)}
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															{t("overview.actions.delete")}
														</TooltipContent>
													</Tooltip>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</div>
				</div>

				{totalElements > limit && (
					<div className="py-4 flex justify-center">
						<CustomPagination
							currentPage={currentPage}
							limit={limit}
							totalElements={totalElements}
							onPageChange={(p) => setCurrentPage(p)}
						/>
					</div>
				)}

				<ViewDetailsAdminProjectDialog
					open={viewDetailsDialogOpen}
					onOpenChange={setViewDetailsDialogOpen}
					project={selectedProject}
				/>

				<ArchiveAdminProjectDialog
					open={archiveDialogOpen}
					onOpenChange={setArchiveDialogOpen}
					project={selectedProject}
				/>

				<DeleteAdminProjectDialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					project={selectedProject}
				/>
			</div>
		</motion.div>
	);
};

export default AdminProjectsOrganization;
