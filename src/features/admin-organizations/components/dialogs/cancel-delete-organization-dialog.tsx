import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcn/dialog";
import { Spinner } from "@/components/shadcn/spinner";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCancelDeleteOrganization } from "../../hooks/use-cancel-delete-organization";
import { useRefetchAdminOrganizations } from "../../hooks/use-refetch-admin-organizations";
import type { AdminOrganization } from "../../types/admin-organizations";

interface CancelDeleteOrganizationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organization: AdminOrganization | null;
}

export const CancelDeleteOrganizationDialog = ({
	open,
	onOpenChange,
	organization,
}: CancelDeleteOrganizationDialogProps) => {
	const { t } = useTranslation("admin-organization");

	const { mutate: cancelDelete, isPending } = useCancelDeleteOrganization();
	const refetchOrganizations = useRefetchAdminOrganizations();

	const handleConfirm = () => {
		if (!organization) return;

		cancelDelete(organization.org_id, {
			onSuccess: () => {
				toast.success(t("cancelDelete.messages.success"));
				onOpenChange(false);
				refetchOrganizations();
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("cancelDelete.dialog.title")}</DialogTitle>
					<DialogDescription>
						{t("cancelDelete.dialog.description")}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="bg-muted p-3 rounded-lg">
						<p className="text-sm font-semibold">{organization?.name}</p>
						<p className="text-xs text-muted-foreground mt-1">
							ID: {organization?.org_id}
						</p>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							{t("cancelDelete.buttons.cancel")}
						</Button>
						<Button
							type="button"
							variant="default"
							onClick={handleConfirm}
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Spinner className="mr-2 h-4 w-4" />
									{t("cancelDelete.buttons.confirming")}
								</>
							) : (
								t("cancelDelete.buttons.confirm")
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
