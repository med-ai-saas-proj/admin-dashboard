import { Checkbox } from "@/components/shadcn/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
	DialogClose,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
import { useTranslation } from "react-i18next";
import { useGetAdminOrganizationPermissions } from "@/features/admin-organizations/hooks/use-get-admin-organization-permissions";
import { useGetAdminUserProfile } from "@/features/general/hooks/use-get-admin-user-profile";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateUserPermissionsInOrganization } from "../../hooks/use-update-user-permissions-in-organization";
import { useAdminOrganizationDetailsStore } from "../../store/admin-organization-details";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const UpdateUserPermissionsInOrganizationDialog = ({
	userId,
}: {
	userId: string;
}): React.JSX.Element => {
	const { t } = useTranslation("admin-organization");
	const params = useParams<{ orgId: string }>();
	const organizationId =
		params.orgId ??
		useAdminOrganizationDetailsStore.getState().organizationId ??
		"";

	const [openDialog, setOpenDialog] = useState(false);

	const { data: allPermissionsInCurrentOrganizationData } =
		useGetAdminOrganizationPermissions();
	const { data: userProfileData } = useGetAdminUserProfile({ userId });
	const { mutate: updatePermissions } =
		useUpdateUserPermissionsInOrganization(organizationId);

	const allPermissionsInCurrentOrganization =
		allPermissionsInCurrentOrganizationData?.results;
	const userProfile = userProfileData?.results;

	const [enabledPermissions, setEnabledPermissions] = useState<Set<string>>(
		new Set()
	);

	useEffect(() => {
		setEnabledPermissions(
			new Set(userProfile?.permissions.organization_permissions)
		);
	}, [userProfile]);

	const handlePermissionChange = (permission: string, checked: boolean) => {
		setEnabledPermissions((prev) => {
			const next = new Set(prev);
			checked ? next.add(permission) : next.delete(permission);
			return next;
		});
	};

	const handleUpdatePermissions = async () => {
		updatePermissions(
			{
				userId,
				permissions: Array.from(enabledPermissions),
			},
			{
				onSuccess: () => {
					toast.success(t("common.toast.success"));
					setOpenDialog(false);
				},
				onError: () => {
					toast.error(t("common.toast.error"));
				},
			}
		);
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>
				<button
					type="button"
					aria-label={t("users.tooltips.update_permissions")}
					className="hover:text-primary transition-colors"
					title={t("users.tooltips.update_permissions")}
				>
					<KeyRound className="h-4 w-4" />
				</button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-3xl">
				<div className="mb-4">
					<h2 className="text-lg font-semibold mb-2">
						{t("users.permissionsDialog.title", "User Permissions")}
					</h2>
					<p className="text-sm text-muted-foreground">
						{t("users.permissionsDialog.username", {
							defaultValue: "UserName: {{username}}",
							username: userProfile?.username,
						})}
					</p>
				</div>
				<div className="max-h-128 overflow-y-auto space-y-4">
					{allPermissionsInCurrentOrganization?.permissions.map(
						(permission) => (
							<div
								key={permission}
								className="flex items-center space-x-2 border p-4 rounded-xl"
							>
								<Checkbox
									id={`permission-${permission}`}
									checked={enabledPermissions.has(permission)}
									onCheckedChange={(value) =>
										handlePermissionChange(permission, !!value)
									}
								/>
								<Label htmlFor={`permission-${permission}`}>{permission}</Label>
							</div>
						)
					)}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">
							{t("users.permissionsDialog.cancel", "Cancel")}
						</Button>
					</DialogClose>
					<Button type="button" onClick={handleUpdatePermissions}>
						{t("users.permissionsDialog.save", "Save changes")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateUserPermissionsInOrganizationDialog;
