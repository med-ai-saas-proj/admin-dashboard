import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { useGetAdminProjectsPermissions } from "@/features/admin-projects/hooks/use-get-admin-projects-permissions";
import { useGetAdminUserProfile } from "@/features/general/hooks/use-get-admin-user-profile";
import { useUpdateUserPermissionsInProject } from "../../hooks/use-update-user-permissions-in-project";
import { useAdminProjectDetailsStore } from "../../store/admin-project-details";

const UpdateUserPermissionsInProjectDialog = ({
	userId,
}: {
	userId: string;
}): React.JSX.Element => {
	const { t } = useTranslation("admin-project");
	const params = useParams<{ projectId: string }>();
	const projectId =
		params.projectId ?? useAdminProjectDetailsStore.getState().projectId ?? "";

	const [openDialog, setOpenDialog] = useState(false);

	const { data: allPermissionsInCurrentProjectData } =
		useGetAdminProjectsPermissions();
	const { data: userProfileData } = useGetAdminUserProfile({
		params: { userId },
		enabled: !!userId,
	});
	const { mutate: updatePermissions } =
		useUpdateUserPermissionsInProject(projectId);

	const allPermissionsInCurrentProject =
		allPermissionsInCurrentProjectData?.results;
	const userProfile = userProfileData?.results;

	const [enabledPermissions, setEnabledPermissions] = useState<Set<string>>(
		new Set()
	);

	useEffect(() => {
		const currentProjectPermissions =
			userProfile?.permissions.project_permissions.find(
				(permission) => permission.project_uuid === projectId
			)?.permissions ?? [];

		setEnabledPermissions(new Set(currentProjectPermissions));
	}, [projectId, userProfile]);

	const handlePermissionChange = (permission: string, checked: boolean) => {
		setEnabledPermissions((prev) => {
			const next = new Set(prev);
			checked ? next.add(permission) : next.delete(permission);
			return next;
		});
	};

	const handleUpdatePermissions = () => {
		if (!projectId) {
			return;
		}

		updatePermissions(
			{
				userId,
				permissions: Array.from(enabledPermissions),
			},
			{
				onSuccess: () => {
					toast.success(
						t("common.toast.updatePermissionsSuccess", {
							defaultValue: "Permissions updated successfully",
						})
					);
					setOpenDialog(false);
				},
				onError: () => {
					toast.error(
						t("common.toast.updatePermissionsError", {
							defaultValue: "Failed to update permissions",
						})
					);
				},
			}
		);
	};

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>
				<button
					type="button"
					aria-label={t("users.tooltips.update_permissions", {
						defaultValue: "Update permissions",
					})}
					className="hover:text-primary transition-colors"
					title={t("users.tooltips.update_permissions", {
						defaultValue: "Update permissions",
					})}
				>
					<KeyRound className="h-4 w-4" />
				</button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-3xl">
				<div className="mb-4">
					<h2 className="mb-2 text-lg font-semibold">
						{t("users.permissionsDialog.title", {
							defaultValue: "User Permissions",
						})}
					</h2>
					<p className="text-sm text-muted-foreground">
						{t("users.permissionsDialog.username", {
							defaultValue: "UserName: {{username}}",
							username: userProfile?.username,
						})}
					</p>
				</div>
				<div className="max-h-128 space-y-4 overflow-y-auto">
					{allPermissionsInCurrentProject?.permissions.map((permission) => (
						<div
							key={permission}
							className="flex items-center space-x-2 rounded-xl border p-4"
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
					))}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">
							{t("users.permissionsDialog.cancel", {
								defaultValue: "Cancel",
							})}
						</Button>
					</DialogClose>
					<Button
						type="button"
						onClick={handleUpdatePermissions}
						disabled={!projectId}
					>
						{t("users.permissionsDialog.save", {
							defaultValue: "Save changes",
						})}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateUserPermissionsInProjectDialog;
