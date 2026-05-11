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
import { useUpdateAdminProjectSettings } from "../../hooks/use-update-admin-project-settings";
import type { AdminProjectDetailsSettings } from "../../types/admin-project-details";

const settingsSchema = z.object({
	rate_limit: z
		.string()
		.trim()
		.min(1, "Rate limit is required")
		.refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, {
			message: "Rate limit must be a non-negative integer",
		}),
	spending_limit: z
		.string()
		.trim()
		.min(1, "Spending limit is required")
		.refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, {
			message: "Spending limit must be a non-negative integer",
		}),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

type UpdateProjectSettingsDialogProps = {
	triggerElement: React.ReactNode;
	projectId: string;
	currentSettings?: AdminProjectDetailsSettings;
};

const UpdateProjectSettingsDialog = ({
	triggerElement,
	projectId,
	currentSettings,
}: UpdateProjectSettingsDialogProps) => {
	const [openDialog, setOpenDialog] = useState(false);
	const { mutate: updateSettings, isPending } = useUpdateAdminProjectSettings();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			rate_limit: currentSettings?.rate_limit?.toString() ?? "",
			spending_limit: currentSettings?.spending_limit?.toString() ?? "",
		},
	});

	useEffect(() => {
		reset({
			rate_limit: currentSettings?.rate_limit?.toString() ?? "",
			spending_limit: currentSettings?.spending_limit?.toString() ?? "",
		});
	}, [currentSettings, reset]);

	const onSubmit = (values: SettingsFormValues) => {
		if (!projectId) {
			toast.error("Missing project ID");
			return;
		}

		updateSettings(
			{
				projectId,
				rate_limit: Number(values.rate_limit),
				spending_limit: Number(values.spending_limit),
			},
			{
				onSuccess: () => {
					toast.success("Project settings updated");
					setOpenDialog(false);
				},
				onError: () => {
					toast.error("Failed to update project settings");
				},
			}
		);
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>{triggerElement}</DialogTrigger>
			<DialogContent className="sm:max-w-2xl" showCloseButton>
				<DialogHeader>
					<DialogTitle>Edit Project Settings</DialogTitle>
					<DialogDescription>
						Update the rate limit and spending limit for this project.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="rate_limit">Rate limit</FieldLabel>
							<Input
								id="rate_limit"
								type="number"
								min={0}
								step={1}
								placeholder="Enter requests per second"
								{...register("rate_limit")}
							/>
							<FieldError errors={[errors.rate_limit]} />
						</Field>

						<Field>
							<FieldLabel htmlFor="spending_limit">Spending limit</FieldLabel>
							<Input
								id="spending_limit"
								type="number"
								min={0}
								step={1}
								placeholder="Enter monthly budget"
								{...register("spending_limit")}
							/>
							<FieldError errors={[errors.spending_limit]} />
						</Field>
					</FieldGroup>

					<DialogFooter className="mt-6">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending || !projectId}>
							{isPending ? "Saving..." : "Save changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateProjectSettingsDialog;
