import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Eye, Pencil, Search } from "lucide-react";

import { Button } from "@/components/shadcn/button";
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
import {
	CreateAdminProjectDialog,
	ViewDetailsAdminProjectDialog,
	UpdateAdminProjectDialog,
} from "./dialogs";

const AdminProjectsOrganization = (): React.JSX.Element => {
	const params = useParams<{ orgId: string }>();
	const orgId = useAdminOrganizationDetailsStore.getState().organizationId;
	const organizationId = orgId ?? params.orgId ?? "";

	const { data, isLoading, isFetching } = useGetAdminProjectsOrganization({
		organizationId,
		limit: 1000,
		offset: 0,
	});

	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "archived" | "active"
	>("all");
	const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [selectedProject, setSelectedProject] =
		useState<AdminProjectOrganization | null>(null);

	const projects = data?.data ?? [];

	const filteredProjects = useMemo(() => {
		return projects.filter((project) => {
			const matchesSearch =
				!searchTerm ||
				project.project_uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(project.description
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ??
					false) ||
				project.organization_id
					.toLowerCase()
					.includes(searchTerm.toLowerCase());

			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "archived" && project.archived) ||
				(statusFilter === "active" && !project.archived);

			return matchesSearch && matchesStatus;
		});
	}, [projects, searchTerm, statusFilter]);

	const handleSearch = () => {
		setSearchTerm(searchInput.trim());
	};

	const handleViewDetails = (project: AdminProjectOrganization) => {
		setSelectedProject(project);
		setViewDetailsDialogOpen(true);
	};

	const handleOpenUpdate = (project: AdminProjectOrganization) => {
		setSelectedProject(project);
		setUpdateDialogOpen(true);
	};

	return (
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
							placeholder="Search projects"
							className="min-w-0"
						/>
						<Button type="submit" variant="default">
							<Search className="size-4" />
							Search
						</Button>
					</div>

					<Select
						value={statusFilter}
						onValueChange={(value) =>
							setStatusFilter(value as typeof statusFilter)
						}
					>
						<SelectTrigger className="w-full sm:w-[220px]">
							<SelectValue placeholder="Filter status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All projects</SelectItem>
							<SelectItem value="active">Not archived</SelectItem>
							<SelectItem value="archived">Archived</SelectItem>
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
						<div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
							{isFetching ? "Loading projects..." : "No projects found"}
						</div>
					) : (
						<Table>
							<TableHeader className="sticky top-0 z-10 bg-background">
								<TableRow>
									<TableHead>UUID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Organization ID</TableHead>
									<TableHead>Archived</TableHead>
									<TableHead className="text-right">Actions</TableHead>
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
											{project.archived ? "Archived" : "Active"}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleOpenUpdate(project)}
														>
															<Pencil className="h-4 w-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>Update</TooltipContent>
												</Tooltip>
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
													<TooltipContent>View details</TooltipContent>
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

			<ViewDetailsAdminProjectDialog
				open={viewDetailsDialogOpen}
				onOpenChange={setViewDetailsDialogOpen}
				project={selectedProject}
			/>

			<UpdateAdminProjectDialog
				open={updateDialogOpen}
				onOpenChange={setUpdateDialogOpen}
				project={selectedProject}
			/>
		</div>
	);
};

export default AdminProjectsOrganization;
