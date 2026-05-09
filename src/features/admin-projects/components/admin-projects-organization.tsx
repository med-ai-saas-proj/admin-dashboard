import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/shadcn/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/table";
import { Input } from "@/components/shadcn/input";
import { Spinner } from "@/components/shadcn/spinner";
import { useGetAdminProjectsOrganization } from "@/features/admin-projects/hooks/use-get-admin-projects-organization";
import { useCreateAdminProjectOrganization } from "@/features/admin-projects/hooks/use-create-admin-project-organization";
import { useAdminOrganizationDetailsStore } from "@/features/admin-organization-details/store/admin-organization-details";

const createProjectSchema = z.object({
	name: z.string().trim().min(1, "Project name is required").max(120),
	description: z
		.string()
		.trim()
		.max(255, "Description must be 255 characters or fewer")
		.optional(),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

type CreateProjectDialogProps = {
	organizationId: string;
};

const CreateProjectDialog = ({ organizationId }: CreateProjectDialogProps) => {
	const [openDialog, setOpenDialog] = useState(false);
	const { mutate: createProject, isPending } =
		useCreateAdminProjectOrganization();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateProjectFormValues>({
		resolver: zodResolver(createProjectSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	useEffect(() => {
		if (!openDialog) {
			reset({
				name: "",
				description: "",
			});
		}
	}, [openDialog, reset]);

	const onSubmit = (values: CreateProjectFormValues) => {
		if (!organizationId) {
			toast.error("Missing organization ID");
			return;
		}

		createProject(
			{
				organizationId,
				name: values.name,
				description: values.description?.trim()
					? values.description.trim()
					: null,
			},
			{
				onSuccess: () => {
					toast.success("Project created");
					setOpenDialog(false);
				},
				onError: () => {
					toast.error("Failed to create project");
				},
			}
		);
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>
				<Button type="button" className="shrink-0">
					Create project
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl" showCloseButton>
				<DialogHeader>
					<DialogTitle>Create Project</DialogTitle>
					<DialogDescription>
						Create a new project for this organization.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Project name</FieldLabel>
							<Input
								id="name"
								placeholder="Enter project name"
								{...register("name")}
							/>
							<FieldError errors={[errors.name]} />
						</Field>

						<Field>
							<FieldLabel htmlFor="description">Description</FieldLabel>
							<Textarea
								id="description"
								rows={4}
								placeholder="Optional project description"
								{...register("description")}
							/>
							<FieldError errors={[errors.description]} />
						</Field>
					</FieldGroup>

					<DialogFooter className="mt-6">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending || !organizationId}>
							{isPending ? "Creating..." : "Create project"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

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

				<CreateProjectDialog organizationId={organizationId} />
			</div>

			<div className="rounded-lg border bg-background shadow-sm">
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
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminProjectsOrganization;
