import { toast } from "sonner";

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
	const { mutate: deleteProject, isPending } =
		useDeleteAdminProjectOrganization();

	const handleDelete = () => {
		if (!project) {
			toast.error("No project selected");
			return;
		}

		deleteProject(
			{
				projectId: project.project_uuid,
			},
			{
				onSuccess: () => {
					toast.success("Project archived successfully");
					onOpenChange(false);
				},
				onError: () => {
					toast.error("Failed to archive project");
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton>
				<DialogHeader>
					<DialogTitle>Archive Project</DialogTitle>
					<DialogDescription>
						Are you sure you want to archive this project? This action will move
						the project to archived status.
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
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending ? "Archiving..." : "Archive Project"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteAdminProjectDialog;
