import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
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
import { useGetAllAdminUserPermissions } from "../../hooks/use-get-all-admin-user-permissions";
import { useUpdateAdminUserPermissions } from "../../hooks/use-update-admin-user-permissions";
import type { UserPermissionsResponse } from "../../types/admin";

type PermissionsPayload = UserPermissionsResponse["results"];
type ProjectPermissionItem = PermissionsPayload["project_permissions"][number];
type PermissionState = Record<string, string[]>;

const UserPermissionsDialog = ({
	userId,
}: {
	userId: string;
}): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const [organizationPermissions, setOrganizationPermissions] = useState<
		string[]
	>([]);
	const [projectPermissionsByProject, setProjectPermissionsByProject] =
		useState<PermissionState>({});

	const { data: permissionsData, isLoading: isPermissionsLoading } =
		useGetAllAdminUserPermissions({ userId });
	const { mutateAsync: updatePermissions, isPending: isUpdating } =
		useUpdateAdminUserPermissions();

	const permissions = permissionsData?.results;

	const organizationPermissionOptions =
		permissions?.organization_permissions ?? [];
	const effectiveOrganizationPermissions =
		permissions?.effective_organization_permissions ?? [];
	const projectPermissionOptions = permissions?.project_permissions ?? [];

	useEffect(() => {
		if (!isOpen || !permissions) {
			return;
		}

		setOrganizationPermissions(permissions.organization_permissions);
		setProjectPermissionsByProject(
			permissions.project_permissions.reduce<PermissionState>(
				(accumulator, projectPermission) => {
					accumulator[projectPermission.project_uuid] =
						projectPermission.permissions;
					return accumulator;
				},
				{}
			)
		);
	}, [isOpen, permissions]);

	const setPermissionChecked = (
		value: string,
		checked: boolean,
		setList: Dispatch<SetStateAction<string[]>>
	) => {
		setList((current) =>
			checked
				? current.includes(value)
					? current
					: [...current, value]
				: current.filter((item) => item !== value)
		);
	};

	const setProjectPermissionChecked = (
		projectUuid: string,
		permission: string,
		checked: boolean
	) => {
		setProjectPermissionsByProject((current) => {
			const currentPermissions = current[projectUuid] ?? [];

			return {
				...current,
				[projectUuid]: checked
					? currentPermissions.includes(permission)
						? currentPermissions
						: [...currentPermissions, permission]
					: currentPermissions.filter((item) => item !== permission),
			};
		});
	};

	const handleUpdate = async () => {
		if (!permissions) {
			return;
		}

		try {
			await updatePermissions({
				userId,
				permissions: {
					organization_permissions: organizationPermissions,
					project_permissions: permissions.project_permissions.map(
						(projectPermission: ProjectPermissionItem) => ({
							project_uuid: projectPermission.project_uuid,
							permissions:
								projectPermissionsByProject[projectPermission.project_uuid] ??
								[],
						})
					),
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

			<DialogContent className="sm:max-w-3xl">
				<h2 className="text-lg font-semibold">User Permissions</h2>
				<p className="text-sm text-muted-foreground">User ID: {userId}</p>

				{isPermissionsLoading ? (
					<p className="text-sm text-muted-foreground">
						Loading permissions...
					</p>
				) : (
					<div className="space-y-5">
						<section className="rounded-md border p-4">
							<h3 className="mb-3 font-medium">Organization Permissions</h3>
							{organizationPermissionOptions.length > 0 ? (
								<div className="space-y-3">
									{organizationPermissionOptions.map((permission) => {
										const isChecked =
											organizationPermissions.includes(permission);

										return (
											<div key={permission} className="rounded-md border p-3">
												<label
													htmlFor={`org-permission-${permission}`}
													className="flex items-center gap-2 text-sm"
												>
													<Checkbox
														id={`org-permission-${permission}`}
														checked={isChecked}
														onCheckedChange={(checked) =>
															setPermissionChecked(
																permission,
																checked === true,
																setOrganizationPermissions
															)
														}
													/>
													<span>{permission}</span>
												</label>

												{isChecked ? (
													<div className="mt-3 rounded-md bg-muted/40 p-3 text-xs">
														<p className="mb-2 font-medium text-foreground">
															Effective permissions
														</p>
														{effectiveOrganizationPermissions.length > 0 ? (
															<div className="flex flex-wrap gap-2">
																{effectiveOrganizationPermissions.map(
																	(effectivePermission) => (
																		<span
																			key={effectivePermission}
																			className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 font-medium text-emerald-800"
																		>
																			{effectivePermission}
																		</span>
																	)
																)}
															</div>
														) : (
															<p className="text-muted-foreground">
																No effective permissions.
															</p>
														)}
													</div>
												) : null}
											</div>
										);
									})}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									No organization permissions available.
								</p>
							)}
						</section>

						<section className="rounded-md border p-4">
							<h3 className="mb-3 font-medium">Project Permissions</h3>

							{projectPermissionOptions.length > 0 ? (
								<div className="space-y-4">
									{projectPermissionOptions.map((projectPermission) => {
										const selectedProjectPermissions =
											projectPermissionsByProject[
												projectPermission.project_uuid
											] ?? [];

										return (
											<div
												key={projectPermission.project_uuid}
												className="rounded-md border p-3"
											>
												<p className="mb-3 text-xs text-muted-foreground">
													Project: {projectPermission.project_uuid}
												</p>

												<div className="space-y-3">
													{projectPermission.permissions.map((permission) => {
														const isChecked =
															selectedProjectPermissions.includes(permission);

														return (
															<div
																key={`${projectPermission.project_uuid}-${permission}`}
																className="rounded-md border p-3"
															>
																<label
																	htmlFor={`project-permission-${projectPermission.project_uuid}-${permission}`}
																	className="flex items-center gap-2 text-sm"
																>
																	<Checkbox
																		id={`project-permission-${projectPermission.project_uuid}-${permission}`}
																		checked={isChecked}
																		onCheckedChange={(checked) =>
																			setProjectPermissionChecked(
																				projectPermission.project_uuid,
																				permission,
																				checked === true
																			)
																		}
																	/>
																	<span>{permission}</span>
																</label>

																{isChecked ? (
																	<div className="mt-3 rounded-md bg-muted/40 p-3 text-xs">
																		<p className="mb-2 font-medium text-foreground">
																			Effective permissions
																		</p>
																		{projectPermission.effective_permissions
																			.length > 0 ? (
																			<div className="flex flex-wrap gap-2">
																				{projectPermission.effective_permissions.map(
																					(effectivePermission) => (
																						<span
																							key={`${projectPermission.project_uuid}-${permission}-${effectivePermission}`}
																							className="inline-flex items-center rounded-full border border-sky-200 bg-sky-100 px-2.5 py-0.5 font-medium text-sky-800"
																						>
																							{effectivePermission}
																						</span>
																					)
																				)}
																			</div>
																		) : (
																			<p className="text-muted-foreground">
																				No effective permissions.
																			</p>
																		)}
																	</div>
																) : null}
															</div>
														);
													})}
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									No project permissions available.
								</p>
							)}
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
						disabled={isUpdating || isPermissionsLoading}
					>
						{isUpdating ? "Updating..." : "Update"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UserPermissionsDialog;
