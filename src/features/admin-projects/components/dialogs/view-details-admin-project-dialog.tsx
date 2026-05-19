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
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation("admin-project");
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
					<DialogTitle>{t("details.dialog.title")}</DialogTitle>
					<DialogDescription>
						{t("details.dialog.description")}
					</DialogDescription>
				</DialogHeader>

				{!project ? (
					<p className="text-sm text-muted-foreground">{t("details.empty")}</p>
				) : (
					<dl className="space-y-4 text-sm">
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">
								{t("details.labels.uuid")}
							</dt>
							<dd className="break-all">{project.project_uuid}</dd>
						</div>
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">
								{t("details.labels.name")}
							</dt>
							<dd>{project.name}</dd>
						</div>
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">
								{t("details.labels.description")}
							</dt>
							<dd>{project.description ?? t("common.notAvailable")}</dd>
						</div>
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">
								{t("details.labels.organizationId")}
							</dt>
							<dd className="break-all">{project.organization_id}</dd>
						</div>
						<div className="space-y-1">
							<dt className="font-medium text-muted-foreground">
								{t("details.labels.status")}
							</dt>
							<dd>
								{project.archived
									? t("details.status.archived")
									: t("details.status.active")}
							</dd>
						</div>
					</dl>
				)}

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">{t("details.buttons.close")}</Button>
					</DialogClose>
					<Button variant="default" onClick={handleViewMore}>
						{t("details.buttons.viewMore")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
