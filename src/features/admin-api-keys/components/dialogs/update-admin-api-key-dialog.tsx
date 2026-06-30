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
import { useGetAdminApiKeyPermissions } from "../../hooks/use-get-admin-api-key-permissions";
import type { AdminApiKey } from "../../types/admin-api-keys";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const updateSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional().or(z.literal("")),
	permissions: z.array(z.string()).default([]),
	disabled: z.boolean().default(false),
});

type UpdateForm = z.input<typeof updateSchema>;
type UpdateFormOutput = z.output<typeof updateSchema>;

const UpdateAdminApiKeyDialog = ({
	open,
	onOpenChange,
	apiKey,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	apiKey: AdminApiKey | null;
}) => {
	const { t } = useTranslation("admin-api-key");
	const projectId = apiKey?.project_uuid || "";
	const updateMutation = useUpdateAdminApiKey(projectId);
	const { data: permissionsData, isLoading: permissionsLoading } =
		useGetAdminApiKeyPermissions();
	const permissions = Array.isArray(permissionsData?.results)
		? permissionsData.results
		: [];

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<UpdateForm, unknown, UpdateFormOutput>({
		resolver: zodResolver(updateSchema),
		defaultValues: {
			name: "",
			description: "",
			permissions: [],
			disabled: false,
		},
	});

	useEffect(() => {
		if (apiKey) {
			reset({
				name: apiKey.name ?? "",
				description: apiKey.description ?? "",
				permissions: apiKey.permissions ?? [],
				disabled: Boolean(apiKey.disabled),
			});
		}
	}, [apiKey, reset]);

	useEffect(() => {
		if (!open) reset();
	}, [open, reset]);

	const onSubmit = (values: UpdateFormOutput) => {
		if (!apiKey) return;

		updateMutation.mutate(
			{
				apiKeyId: apiKey.api_key_uuid,
				name: values.name,
				description: values.description || "",
				permissions: values.permissions ?? [],
				disabled: values.disabled,
			},
			{
				onSuccess: () => {
					toast.success(t("common.toast.updateSuccess"));
					reset();
					onOpenChange(false);
				},
			}
		);
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
					<div>
						<Label className="text-sm font-medium mb-2">
							{t("update.form.labels.permissions")}
						</Label>
						<div className="mt-2 max-h-80 overflow-y-auto rounded-md border border-slate-200 p-3">
							{permissionsLoading ? (
								<div className="text-sm text-muted-foreground">
									{t("update.form.permissions.loading")}
								</div>
							) : permissions.length > 0 ? (
								<Controller
									control={control}
									name="permissions"
									render={({ field }) => {
										const selectedPermissions = field.value ?? [];

										return (
											<div className="space-y-3">
												{permissions.map((permission) => {
													const checked = selectedPermissions.includes(
														permission.id
													);

													return (
														<div
															key={permission.id}
															className="flex items-start gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 transition-colors hover:bg-slate-50"
														>
															<Checkbox
																id={`permission-${permission.id}`}
																checked={checked}
																onCheckedChange={(nextChecked) => {
																	const nextValue = Boolean(nextChecked);

																	field.onChange(
																		nextValue
																			? [...selectedPermissions, permission.id]
																			: selectedPermissions.filter(
																					(value) => value !== permission.id
																				)
																	);
																}}
															/>
															<div className="space-y-0.5">
																<div className="text-sm font-medium text-slate-900">
																	{permission.name}
																</div>
																<div className="text-xs text-slate-500">
																	{permission.description}
																</div>
																<div className="font-mono text-[11px] text-slate-400">
																	{permission.id}
																</div>
															</div>
														</div>
													);
												})}
											</div>
										);
									}}
								/>
							) : (
								<div className="text-sm text-muted-foreground">
									{t("update.form.permissions.empty")}
								</div>
							)}
						</div>
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
