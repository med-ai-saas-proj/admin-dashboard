import { useEffect, useMemo, useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogFooter,
	DialogClose,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { useUpdateAdminUserPermissions } from "../../hooks/use-update-admin-user-permissions";
import type { UserProfileInfo } from "../../types/admin";

const ORGANIZATION_PERMISSION_OPTIONS = ["ORG_READ", "ORG_WRITE"];
const PROJECT_PERMISSION_OPTIONS = ["PROJECT_READ", "PROJECT_WRITE"];

const UserPermissionsDialog = ({
	userId,
	permissions,
	isProfileLoading,
}: {
	userId: string;
	permissions?: UserProfileInfo["permissions"];
	isProfileLoading?: boolean;
}): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const [organizationPermissions, setOrganizationPermissions] = useState<
		string[]
	>([]);
	const [projectPermissions, setProjectPermissions] = useState<string[]>([]);

	const { mutateAsync: updatePermissions, isPending: isUpdating } =
		useUpdateAdminUserPermissions();

	const initialPermissions = permissions;
	const currentProjectId = useMemo(() => {
		return initialPermissions?.project_permissions?.[0]?.id ?? "";
	}, [initialPermissions]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setOrganizationPermissions(
			initialPermissions?.organization_permissions ?? []
		);
		setProjectPermissions(
			initialPermissions?.project_permissions?.[0]?.permissions ?? []
		);
	}, [isOpen, initialPermissions]);

	const togglePermission = (
		value: string,
		list: string[],
		setList: (next: string[]) => void
	) => {
		const isSelected = list.includes(value);
		if (isSelected) {
			setList(list.filter((item) => item !== value));
			return;
		}
		setList([...list, value]);
	};

	const handleUpdate = async () => {
		try {
			await updatePermissions({
				userId,
				permissions: {
					organization_permissions: organizationPermissions,
					project_permissions: [
						{
							project_id: currentProjectId,
							permissions: projectPermissions,
						},
					],
				},
			});
			toast("Permissions updated");
			setIsOpen(false);
		} catch {
			toast("Failed to update permissions");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					aria-label="View permissions"
					className="hover:text-primary transition-colors"
					title="View permissions"
				>
					<KeyRound className="h-4 w-4" />
				</button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<h2 className="text-lg font-semibold">User Permissions</h2>
				<p className="text-sm text-muted-foreground">User ID: {userId}</p>

				{isProfileLoading ? (
					<p className="text-sm text-muted-foreground">
						Loading permissions...
					</p>
				) : (
					<div className="space-y-5">
						<section className="rounded-md border p-4">
							<h3 className="mb-3 font-medium">Organization Permissions</h3>
							<div className="space-y-2">
								{ORGANIZATION_PERMISSION_OPTIONS.map((permission) => (
									<label
										key={permission}
										htmlFor={`org-permission-${permission}`}
										className="flex items-center gap-2 text-sm"
									>
										<Checkbox
											id={`org-permission-${permission}`}
											checked={organizationPermissions.includes(permission)}
											onCheckedChange={() =>
												togglePermission(
													permission,
													organizationPermissions,
													setOrganizationPermissions
												)
											}
										/>
										<span>{permission}</span>
									</label>
								))}
							</div>
						</section>

						<section className="rounded-md border p-4">
							<h3 className="mb-3 font-medium">Project Permissions</h3>
							<p className="mb-3 text-xs text-muted-foreground">
								Project: {currentProjectId}
							</p>
							<div className="space-y-2">
								{PROJECT_PERMISSION_OPTIONS.map((permission) => (
									<label
										key={permission}
										htmlFor={`project-permission-${permission}`}
										className="flex items-center gap-2 text-sm"
									>
										<Checkbox
											id={`project-permission-${permission}`}
											checked={projectPermissions.includes(permission)}
											onCheckedChange={() =>
												togglePermission(
													permission,
													projectPermissions,
													setProjectPermissions
												)
											}
										/>
										<span>{permission}</span>
									</label>
								))}
							</div>
						</section>
					</div>
				)}

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" disabled={isUpdating}>
							Cancel
						</Button>
					</DialogClose>
					<Button
						onClick={handleUpdate}
						disabled={isUpdating || isProfileLoading}
					>
						{isUpdating ? "Updating..." : "Update"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UserPermissionsDialog;
