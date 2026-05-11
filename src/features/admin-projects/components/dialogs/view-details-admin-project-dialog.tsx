import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogClose,
	DialogTitle,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import type { AdminProjectOrganization } from "@/features/admin-projects/types/admin-projects";
import { useNavigate } from "react-router-dom";

type ViewDetailsAdminProjectDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	project: AdminProjectOrganization | null;
};

export const ViewDetailsAdminProjectDialog = ({
	open,
	onOpenChange,
	project,
}: ViewDetailsAdminProjectDialogProps) => {
	const navigate = useNavigate();

	const handleViewMore = () => {
		if (project) {
			navigate(
				`/organizations/${project.organization_id}/projects/${project.project_uuid}`
			);
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl" showCloseButton>
				<DialogHeader>
					<DialogTitle>Project details</DialogTitle>
					<DialogDescription>
						Overview of the selected project.
					</DialogDescription>
				</DialogHeader>

				{!project ? (
					<p className="text-sm text-muted-foreground">No project selected.</p>
				) : (
					<dl className="space-y-4 text-sm">
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">UUID</dt>
							<dd className="break-all">{project.project_uuid}</dd>
						</div>
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">Name</dt>
							<dd>{project.name}</dd>
						</div>
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">Description</dt>
							<dd>{project.description ?? "-"}</dd>
						</div>
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">
								Organization ID
							</dt>
							<dd className="break-all">{project.organization_id}</dd>
						</div>
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">Status</dt>
							<dd>{project.archived ? "Archived" : "Active"}</dd>
						</div>
					</dl>
				)}

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Close</Button>
					</DialogClose>
					<Button variant="default" onClick={handleViewMore}>
						View More
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
