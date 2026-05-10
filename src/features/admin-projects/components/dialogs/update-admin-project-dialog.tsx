import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcn/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import type { AdminProjectOrganization } from "@/features/admin-projects/types/admin-projects";
import { useUpdateAdminProjectOrganization } from "@/features/admin-projects/hooks/use-update-admin-project-organization";

const updateProjectSchema = z.object({
	name: z.string().trim().min(1, "Project name is required").max(120),
	description: z
		.string()
		.trim()
		.max(255, "Description must be 255 characters or fewer")
		.optional(),
});

type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;

type UpdateAdminProjectDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	project: AdminProjectOrganization | null;
};

export const UpdateAdminProjectDialog = ({
	open,
	onOpenChange,
	project,
}: UpdateAdminProjectDialogProps) => {
	const { mutate: updateProject, isPending } =
		useUpdateAdminProjectOrganization();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UpdateProjectFormValues>({
		resolver: zodResolver(updateProjectSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	useEffect(() => {
		if (project && open) {
			reset({
				name: project.name,
				description: project.description ?? "",
			});
		}
		if (!open) {
			reset({ name: "", description: "" });
		}
	}, [project, open, reset]);

	const onSubmit = (values: UpdateProjectFormValues) => {
		if (!project) {
			toast.error("No project selected");
			return;
		}

		updateProject(
			{
				projectId: project.project_uuid,
				name: values.name,
				description: values.description?.trim() || null,
			},
			{
				onSuccess: () => {
					toast.success("Project updated");
					onOpenChange(false);
				},
				onError: () => {
					toast.error("Failed to update project");
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl" showCloseButton>
				<DialogHeader>
					<DialogTitle>Update Project</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Project name</FieldLabel>
							<Input id="name" {...register("name")} />
							<FieldError errors={[errors.name]} />
						</Field>

						<Field>
							<FieldLabel htmlFor="description">Description</FieldLabel>
							<Textarea
								id="description"
								rows={4}
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
						<Button type="submit" disabled={isPending}>
							{isPending ? "Updating..." : "Update project"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
