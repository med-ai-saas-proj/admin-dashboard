import { useEffect, useMemo, useState } from "react";
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
// import { Textarea } from "@/components/shadcn/textarea";
import { useUpdateOrganizationSettings } from "../../hooks/use-update-organization-settings";
import type { AdminOrganizationSettings } from "../../types/admin-organization-details";

const createSettingsSchema = (t: (key: string) => string) =>
	z.object({
		rate_limit: z
			.string()
			.trim()
			.min(1, t("settings.validation.rateLimitRequired"))
			.refine(
				(value) => Number.isInteger(Number(value)) && Number(value) >= 0,
				{
					message: t("settings.validation.rateLimitNonNegative"),
				}
			),
		spending_limit: z
			.string()
			.trim()
			.min(1, t("settings.validation.spendingLimitRequired"))
			.refine(
				(value) => Number.isInteger(Number(value)) && Number(value) >= 0,
				{
					message: t("settings.validation.spendingLimitNonNegative"),
				}
			),
		// extraJson: z
		// 	.string()
		// 	.trim()
		// 	.optional()
		// 	.refine(
		// 		(value) => {
		// 			if (!value) return true;

		// 			try {
		// 				const parsedValue = JSON.parse(value) as unknown;
		// 				if (
		// 					!parsedValue ||
		// 					typeof parsedValue !== "object" ||
		// 					Array.isArray(parsedValue)
		// 				) {
		// 					return false;
		// 				}

		// 				return Object.values(parsedValue as Record<string, unknown>).every(
		// 					(entry) => typeof entry === "string"
		// 				);
		// 			} catch {
		// 				return false;
		// 			}
		// 		},
		// 		{
		// 			message: "Additional metadata must be a JSON object with string values",
		// 		}
		// 	),
	});

type SettingsFormValues = z.infer<ReturnType<typeof createSettingsSchema>>;

type UpdateOrganizationSettingsDialogProps = {
	triggerElement: React.ReactNode;
	organizationId: string;
	currentSettings?: AdminOrganizationSettings;
};

// const formatExtraJson = (extra: AdminOrganizationSettings["extra"] = {}) =>
//     JSON.stringify(extra, null, 2);

const UpdateOrganizationSettingsDialog = ({
	triggerElement,
	organizationId,
	currentSettings,
}: UpdateOrganizationSettingsDialogProps) => {
	const [openDialog, setOpenDialog] = useState(false);
	const { t } = useTranslation("admin-organization");
	const settingsSchema = useMemo(() => createSettingsSchema(t), [t]);
	const { mutate: updateSettings, isPending } = useUpdateOrganizationSettings();
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
			// extraJson: formatExtraJson(currentSettings?.extra),
		},
	});

	useEffect(() => {
		reset({
			rate_limit: currentSettings?.rate_limit?.toString() ?? "",
			spending_limit: currentSettings?.spending_limit?.toString() ?? "",
			// extraJson: formatExtraJson(currentSettings?.extra),
		});
	}, [currentSettings, reset]);

	const onSubmit = (values: SettingsFormValues) => {
		if (!organizationId) {
			toast.error(t("settings.messages.missingOrgId"));
			return;
		}

		// let extra: Record<string, string> | undefined;
		// if (values.extraJson?.trim()) {
		// 	extra = JSON.parse(values.extraJson) as Record<string, string>;
		// }

		updateSettings(
			{
				organizationId,
				rate_limit: Number(values.rate_limit),
				spending_limit: Number(values.spending_limit),
				// extra,
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

						{/* <Field>
							<FieldLabel htmlFor="extraJson">
								Additional metadata JSON
							</FieldLabel>
							<Textarea
								id="extraJson"
								rows={6}
								placeholder='{"region": "us-east-1", "tier": "enterprise"}'
								{...register("extraJson")}
							/>
							<FieldError errors={[errors.extraJson]} />
						</Field> */}
					</FieldGroup>

					<DialogFooter className="mt-6">
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={isPending}>
								{t("settings.buttons.cancel")}
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending || !organizationId}>
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

export default UpdateOrganizationSettingsDialog;
