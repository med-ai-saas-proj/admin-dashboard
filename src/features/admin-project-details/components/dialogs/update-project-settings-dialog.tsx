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
	const { t } = useTranslation("admin-project");
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
			toast.error(t("settings.messages.missingProjectId"));
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
					toast.success(t("settings.messages.success"));
					setOpenDialog(false);
				},
				onError: () => {
					toast.error(t("settings.messages.error"));
				},
			}
		);
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>{triggerElement}</DialogTrigger>
			<DialogContent className="sm:max-w-2xl" showCloseButton>
				<DialogHeader>
					<DialogTitle>{t("settings.dialog.title")}</DialogTitle>
					<DialogDescription>
						{t("settings.dialog.description")}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="rate_limit">
								{t("settings.labels.rateLimit")}
							</FieldLabel>
							<Input
								id="rate_limit"
								type="number"
								min={0}
								step={1}
								placeholder={t("settings.placeholders.rateLimit")}
								{...register("rate_limit")}
							/>
							<FieldError errors={[errors.rate_limit]} />
						</Field>

						<Field>
							<FieldLabel htmlFor="spending_limit">
								{t("settings.labels.spendingLimit")}
							</FieldLabel>
							<Input
								id="spending_limit"
								type="number"
								min={0}
								step={1}
								placeholder={t("settings.placeholders.spendingLimit")}
								{...register("spending_limit")}
							/>
							<FieldError errors={[errors.spending_limit]} />
						</Field>
					</FieldGroup>

					<DialogFooter className="mt-6">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								{t("settings.buttons.cancel")}
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending || !projectId}>
							{isPending
								? t("settings.buttons.saving")
								: t("settings.buttons.save")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateProjectSettingsDialog;
