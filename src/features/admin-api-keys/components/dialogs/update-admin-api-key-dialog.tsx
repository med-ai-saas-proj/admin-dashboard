import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { useUpdateAdminApiKey } from "../../hooks/use-update-admin-api-key";

const updateSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional().or(z.literal("")),
	disabled: z.boolean().optional(),
});

type UpdateForm = z.infer<typeof updateSchema>;

import { useTranslation } from "react-i18next";

const UpdateAdminApiKeyDialog = ({ open, onOpenChange, apiKey }: any) => {
	const { t } = useTranslation("admin-api-key");
	const projectId = apiKey?.project_uuid || "";
	const updateMutation = useUpdateAdminApiKey(projectId);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<UpdateForm>({
		resolver: zodResolver(updateSchema),
		defaultValues: { name: "", description: "", disabled: false },
	});

	useEffect(() => {
		if (apiKey) {
			reset({
				name: apiKey.name ?? "",
				description: apiKey.description ?? "",
				disabled: Boolean(apiKey.disabled),
			});
		}
	}, [apiKey, reset]);

	useEffect(() => {
		if (!open) reset();
	}, [open, reset]);

	const onSubmit = async (values: UpdateForm) => {
		if (!apiKey) return;

		const data = await updateMutation.mutateAsync({
			apiKeyId: apiKey.api_key_uuid,
			name: values.name,
			description: values.description || "",
			permissions: apiKey.permissions,
		});

		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<span />
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{t("update.dialog.title")}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<div>
						<Label className="text-sm font-medium mb-2">
							{t("update.form.labels.name")}
						</Label>
						<Input {...register("name")} />
						{errors.name && (
							<div className="text-xs text-destructive">
								{String(errors.name.message)}
							</div>
						)}
					</div>
					<div>
						<Label className="text-sm font-medium mb-2">
							{t("update.form.labels.description")}
						</Label>
						<Input {...register("description")} />
					</div>
					<div className="flex items-center gap-2">
						<Controller
							control={control}
							name="disabled"
							render={({ field }) => (
								<Checkbox
									checked={field.value}
									onCheckedChange={(v) => field.onChange(Boolean(v))}
								/>
							)}
						/>
						<span className="text-sm">{t("update.form.labels.disabled")}</span>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="ghost" type="button">
								{t("update.buttons.cancel")}
							</Button>
						</DialogClose>
						<Button
							type="submit"
							disabled={isSubmitting || updateMutation.isPending}
						>
							{updateMutation.isPending
								? t("update.buttons.updating")
								: t("update.buttons.update")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateAdminApiKeyDialog;
