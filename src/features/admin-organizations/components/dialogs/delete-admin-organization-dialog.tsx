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
import { useDeleteAdminOrganization } from "../../hooks/use-delete-admin-organization";
import { useGetAdminOrganizations } from "../../hooks/use-get-admin-organizations";
import type { AdminOrganization } from "../../types/admin-organizations";

interface DeleteAdminOrganizationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organization: AdminOrganization | null;
}

export const DeleteAdminOrganizationDialog = ({
	open,
	onOpenChange,
	organization,
}: DeleteAdminOrganizationDialogProps) => {
	const { t } = useTranslation("admin-organization");

	const { mutate: deleteOrganization, isPending } =
		useDeleteAdminOrganization();
	const { refetch } = useGetAdminOrganizations();

	const handleConfirm = () => {
		if (!organization) return;

		deleteOrganization(
			{
				organization_id: organization.org_id,
			},
			{
				onSuccess: () => {
					toast.success(t("delete.messages.success"));
					onOpenChange(false);
					refetch();
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("delete.dialog.title")}</DialogTitle>
					<DialogDescription>
						{t("delete.dialog.description")}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="bg-destructive/10 p-3 rounded-lg">
						<p className="text-sm font-semibold">{organization?.name}</p>
						<p className="text-xs text-muted-foreground mt-1">
							ID: {organization?.org_id}
						</p>
					</div>

					<p className="text-sm text-muted-foreground">{t("delete.warning")}</p>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							{t("create.action.cancel") || "Cancel"}
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleConfirm}
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Spinner className="mr-2 h-4 w-4" />
									{t("delete.buttons.deleting")}
								</>
							) : (
								t("delete.buttons.delete")
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
