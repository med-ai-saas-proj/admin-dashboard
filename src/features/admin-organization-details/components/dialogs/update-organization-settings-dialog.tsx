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
// import { Textarea } from "@/components/shadcn/textarea";
import { useUpdateOrganizationSettings } from "../../hooks/use-update-organization-settings";
import type { AdminOrganizationSettings } from "../../types/admin-organization-details";

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

type SettingsFormValues = z.infer<typeof settingsSchema>;

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
			toast.error("Missing organization ID");
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
					toast.success("Organization settings updated");
					setOpenDialog(false);
				},
				onError: () => {
					toast.error("Failed to update organization settings");
				},
			}
		);
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>{triggerElement}</DialogTrigger>
			<DialogContent className="sm:max-w-2xl" showCloseButton>
				<DialogHeader>
					<DialogTitle>Edit Organization Settings</DialogTitle>
					<DialogDescription>
						Update rate limits, spending limits, and additional metadata for
						this organization.
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
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending || !organizationId}>
							{isPending ? "Saving..." : "Save changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateOrganizationSettingsDialog;
