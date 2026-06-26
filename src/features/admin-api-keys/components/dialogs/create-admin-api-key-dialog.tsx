import { useEffect, useState } from "react";
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
import { Label } from "@/components/shadcn/label";
import { Checkbox } from "@/components/shadcn/checkbox";
import { useCreateAdminApiKey } from "../../hooks/use-create-admin-api-key";
import { useGetAdminApiKeyPermissions } from "../../hooks/use-get-admin-api-key-permissions";
import { useTranslation } from "react-i18next";
import { SaveAdminAPIKeyDialog } from "./save-admin-api-key-dialog";

const createSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional().or(z.literal("")),
	permissions: z.array(z.string()).default([]),
	// disabled: z.boolean().optional(),
});

type CreateForm = z.input<typeof createSchema>;
type CreateFormOutput = z.output<typeof createSchema>;

export const CreateAdminApiKeyDialog = ({
	projectId,
}: {
	projectId: string;
}) => {
	const { t } = useTranslation("admin-api-key");

	const [open, setOpen] = useState(false);
	const [openSaveDialog, setOpenSaveDialog] = useState(false);
	const [createdApiKey, setCreatedApiKey] = useState<{ key: string } | null>(
		null
	);

	const { mutate: createApiKey, isPending } = useCreateAdminApiKey();
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
	} = useForm<CreateForm, unknown, CreateFormOutput>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			name: "",
			description: "",
			permissions: [],
			// disabled: false,
		},
	});

	useEffect(() => {
		if (!open) {
			reset();
		}
	}, [open, reset]);

	const onSubmit = async (values: CreateFormOutput) => {
		createApiKey(
			{
				projectId,
				name: values.name,
				description: values.description ?? "",
				permissions: values.permissions ?? [],
			},
			{
				onSuccess: (data) => {
					setOpen(false);
					setOpenSaveDialog(true);
					setCreatedApiKey({ key: data.results.key });
					reset();
				},
			}
		);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="default">{t("overview.buttons.create")}</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>{t("create.dialog.title")}</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
						<div>
							<Label className="text-sm font-medium">
								{t("create.form.labels.name")}
							</Label>
							<Input {...register("name")} />
							{errors.name && (
								<div className="text-xs text-destructive">
									{String(errors.name.message)}
								</div>
							)}
						</div>

						<div>
							<Label className="text-sm font-medium">
								{t("create.form.labels.description")}
							</Label>
							<Input {...register("description")} />
						</div>

						<div>
							<Label className="text-sm font-medium">
								{t("create.form.labels.permissions")}
							</Label>
							<div className="mt-2 rounded-md border border-slate-200 p-3 max-h-132 overflow-y-auto">
								{permissionsLoading ? (
									<div className="text-sm text-muted-foreground">
										{t("create.form.permissions.loading")}
									</div>
								) : permissions.length > 0 ? (
									<Controller
										control={control}
										name="permissions"
										render={({ field }) => (
											<div className="space-y-3">
												{permissions.map((permission) => {
													const selectedPermissions = field.value ?? [];
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
																<div className="text-[11px] font-mono text-slate-400">
																	{permission.id}
																</div>
															</div>
														</div>
													);
												})}
											</div>
										)}
									/>
								) : (
									<div className="text-sm text-muted-foreground">
										{t("create.form.permissions.empty")}
									</div>
								)}
							</div>
						</div>

						{/* <div className="flex items-center gap-2">
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
							<span className="text-sm">{t("create.form.labels.disabled")}</span>
						</div> */}

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="ghost" type="button">
									{t("create.buttons.cancel")}
								</Button>
							</DialogClose>
							<Button type="submit" disabled={isSubmitting || isPending}>
								{t("create.buttons.create")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<SaveAdminAPIKeyDialog
				open={openSaveDialog}
				onOpenChange={setOpenSaveDialog}
				apiKey={createdApiKey?.key}
			/>
		</>
	);
};

export default CreateAdminApiKeyDialog;
