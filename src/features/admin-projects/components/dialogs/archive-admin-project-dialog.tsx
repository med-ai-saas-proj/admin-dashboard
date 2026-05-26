import { useTranslation } from "react-i18next";
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
} from "@/components/shadcn/dialog";
import type { AdminProjectOrganization } from "@/features/admin-projects/types/admin-projects";
import { useArchiveAdminProjectOrganization } from "@/features/admin-projects/hooks/use-archive-admin-project-organization";
import { useUnarchiveAdminProjectOrganization } from "@/features/admin-projects/hooks/use-unarchive-admin-project-organization";

type ArchiveAdminProjectDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	project: AdminProjectOrganization | null;
};

export const ArchiveAdminProjectDialog = ({
	open,
	onOpenChange,
	project,
}: ArchiveAdminProjectDialogProps) => {
	const { t } = useTranslation("admin-project");
	const { mutate: archiveProject, isPending: isArchiving } =
		useArchiveAdminProjectOrganization();
	const { mutate: unarchiveProject, isPending: isUnarchiving } =
		useUnarchiveAdminProjectOrganization();

	const isArchived = project?.archived ?? false;
	const isPending = isArchived ? isUnarchiving : isArchiving;
	const actionKey = isArchived ? "unarchive" : "archive";

	const handleSubmit = () => {
		if (!project) {
			toast.error(t(`${actionKey}.messages.noProjectSelected`));
			return;
		}

		const mutate = isArchived ? unarchiveProject : archiveProject;
		mutate(project.project_uuid, {
			onSuccess: () => {
				toast.success(t(`${actionKey}.messages.success`));
				onOpenChange(false);
			},
			onError: () => {
				toast.error(t(`${actionKey}.messages.error`));
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl" showCloseButton>
				<DialogHeader>
					<DialogTitle>{t(`${actionKey}.dialog.title`)}</DialogTitle>
					<DialogDescription>
						{t(`${actionKey}.dialog.description`)}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-2 py-4">
					<p className="text-sm text-muted-foreground">
						{t(`${actionKey}.labels.project`)}:{" "}
						<span className="font-semibold text-foreground">
							{project?.name ?? t("common.notAvailable")}
						</span>
					</p>
					<p className="text-sm text-muted-foreground">
						{t(`${actionKey}.labels.uuid`)}:{" "}
						<span className="font-mono text-xs text-foreground">
							{project?.project_uuid ?? t("common.notAvailable")}
						</span>
					</p>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" disabled={isPending}>
							{t(`${actionKey}.buttons.cancel`)}
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant={isArchived ? "default" : "destructive"}
						onClick={handleSubmit}
						disabled={isPending}
					>
						{isPending
							? t(
									`${actionKey}.buttons.${isArchived ? "restoring" : "archiving"}`
								)
							: t(`${actionKey}.buttons.${isArchived ? "restore" : "archive"}`)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
