import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
import { useAdminOrganizationDetailsStore } from "../../store/admin-organization-details";
import { useGetAdminOrganizationPermissions } from "@/features/admin-organizations/hooks/use-get-admin-organization-permissions";
import { useAddAdminOrganizationUser } from "../../hooks/use-add-admin-organization-user";

const addUserSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	permissions: z
		.array(z.string())
		.min(1, "At least one permission is required"),
});

type AddUserForm = z.input<typeof addUserSchema>;
type AddUserFormOutput = z.output<typeof addUserSchema>;

const AddOrganizationUserDialog = (): React.JSX.Element => {
	const { t } = useTranslation("admin-organization");
	const params = useParams<{ orgId: string }>();
	const organizationId =
		params.orgId ??
		useAdminOrganizationDetailsStore.getState().organizationId ??
		"";

	const [open, setOpen] = useState(false);

	const { data: permissionsData } = useGetAdminOrganizationPermissions();
	const { mutate: addUser, isPending } = useAddAdminOrganizationUser();

	const allPermissions = permissionsData?.results?.permissions ?? [];

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<AddUserForm, unknown, AddUserFormOutput>({
		resolver: zodResolver(addUserSchema),
		defaultValues: {
			userId: "",
			permissions: [],
		},
	});

	useEffect(() => {
		if (!open) {
			reset();
		}
	}, [open, reset]);

	const onSubmit = (values: AddUserFormOutput) => {
		addUser(
			{
				organizationId,
				userId: values.userId,
				permissions: values.permissions,
			},
			{
				onSuccess: () => {
					toast.success(t("users.addUserDialog.messages.success"));
					setOpen(false);
				},
				onError: () => {
					toast.error(t("users.addUserDialog.messages.error"));
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default" size="sm">
					{t("users.buttons.addMember")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{t("users.addUserDialog.title")}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* User ID Input */}
					<div>
						<Label className="text-sm font-medium">
							{t("users.addUserDialog.userId")}
						</Label>
						<Input
							{...register("userId")}
							placeholder={t("users.addUserDialog.userIdPlaceholder")}
						/>
						{errors.userId && (
							<p className="text-xs text-destructive mt-1">
								{String(errors.userId.message)}
							</p>
						)}
					</div>

					{/* Permissions Section */}
					<div>
						<Label className="text-sm font-medium">
							{t("users.addUserDialog.selectPermissions")}
						</Label>
						<div className="max-h-64 overflow-y-auto border rounded-md p-2 mt-1 space-y-1">
							{allPermissions.length === 0 ? (
								<p className="text-sm text-muted-foreground py-2 text-center">
									{t("users.status.loading")}
								</p>
							) : (
								<Controller
									control={control}
									name="permissions"
									render={({ field }) => (
										<>
											{allPermissions.map((permission) => {
												const isChecked = field.value.includes(permission);
												return (
													<div
														key={permission}
														className="flex items-center space-x-2 border rounded-md p-3"
													>
														<Checkbox
															id={`add-permission-${permission}`}
															checked={isChecked}
															onCheckedChange={(checked) => {
																if (checked) {
																	field.onChange([...field.value, permission]);
																} else {
																	field.onChange(
																		field.value.filter(
																			(p: string) => p !== permission
																		)
																	);
																}
															}}
														/>
														<Label
															htmlFor={`add-permission-${permission}`}
															className="cursor-pointer"
														>
															{permission}
														</Label>
													</div>
												);
											})}
										</>
									)}
								/>
							)}
						</div>
						{errors.permissions && (
							<p className="text-xs text-destructive mt-1">
								{String(errors.permissions.message)}
							</p>
						)}
					</div>

					{/* Footer */}
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								{t("users.addUserDialog.cancel")}
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending}>
							{isPending
								? t("users.addUserDialog.adding")
								: t("users.addUserDialog.add")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddOrganizationUserDialog;
