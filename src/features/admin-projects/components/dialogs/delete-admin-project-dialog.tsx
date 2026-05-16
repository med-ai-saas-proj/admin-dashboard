import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/shadcn/dialog";
import type { AdminProjectOrganization } from "@/features/admin-projects/types/admin-projects";
import { useDeleteAdminProjectOrganization } from "@/features/admin-projects/hooks/use-delete-admin-project-organization";

type DeleteAdminProjectDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	project: AdminProjectOrganization | null;
};

export const DeleteAdminProjectDialog = ({
	open,
	onOpenChange,
	project,
}: DeleteAdminProjectDialogProps) => {
	const { t } = useTranslation("admin-project");

	const { mutate: deleteProject, isPending } =
		useDeleteAdminProjectOrganization();

	const handleDelete = () => {
		if (!project) {
			toast.error(t("delete.messages.noProjectSelected"));
			return;
		}

		deleteProject(
			{
				projectId: project.project_uuid,
			},
			{
				onSuccess: () => {
					toast.success(t("delete.messages.success"));
					onOpenChange(false);
				},
				onError: () => {
					toast.error(t("delete.messages.error"));
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton>
				<DialogHeader>
					<DialogTitle>{t("delete.dialog.title")}</DialogTitle>
					<DialogDescription>
						{t("delete.dialog.description")}
					</DialogDescription>
				</DialogHeader>

				<div className="py-4 space-y-2">
					<p className="text-sm text-muted-foreground">
						Project: <span className="font-semibold">{project?.name}</span>
					</p>
					<p className="text-sm text-muted-foreground">
						UUID:{" "}
						<span className="font-mono text-xs">{project?.project_uuid}</span>
					</p>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" disabled={isPending}>
							{t("delete.buttons.cancel")}
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending
							? t("delete.buttons.deleting")
							: t("delete.buttons.delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteAdminProjectDialog;
