import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { useCreateAdminProjectOrganization } from "@/features/admin-projects/hooks/use-create-admin-project-organization";

const createProjectSchema = z.object({
	name: z.string().trim().min(1, "Project name is required").max(120),
	description: z
		.string()
		.trim()
		.max(255, "Description must be 255 characters or fewer")
		.optional(),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

type CreateAdminProjectDialogProps = {
	organizationId: string;
};

export const CreateAdminProjectDialog = ({
	organizationId,
}: CreateAdminProjectDialogProps) => {
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
