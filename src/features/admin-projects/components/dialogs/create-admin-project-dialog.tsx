import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation("admin-project");

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
			toast.error(t("create.messages.missingOrgId"));
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
					toast.success(t("create.messages.success"));
					setOpenDialog(false);
				},
				onError: () => {
					toast.error(t("create.messages.error"));
				},
			}
		);
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>
				<Button type="button" className="shrink-0">
					{t("overview.buttons.create")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xl" showCloseButton>
				<DialogHeader>
					<DialogTitle>{t("create.dialog.title")}</DialogTitle>
					<DialogDescription>
						{t("create.dialog.description")}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">
								{t("create.form.labels.name")}
							</FieldLabel>
							<Input
								id="name"
								placeholder={t("create.form.placeholders.name")}
								{...register("name")}
							/>
							<FieldError errors={[errors.name]} />
						</Field>

						<Field>
							<FieldLabel htmlFor="description">
								{t("create.form.labels.description")}
							</FieldLabel>
							<Textarea
								id="description"
								rows={4}
								placeholder={t("create.form.placeholders.description")}
								{...register("description")}
							/>
							<FieldError errors={[errors.description]} />
						</Field>
					</FieldGroup>

					<DialogFooter className="mt-6">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								{t("create.buttons.cancel")}
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending || !organizationId}>
							{isPending
								? t("create.buttons.creating")
								: t("create.buttons.create")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
