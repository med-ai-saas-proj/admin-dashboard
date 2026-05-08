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
					toast.success("Organization deleted successfully");
					onOpenChange(false);
					refetch();
				},
				onError: () => {
					toast.error("Failed to delete organization");
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Organization</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this organization?
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="bg-destructive/10 p-3 rounded-lg">
						<p className="text-sm font-semibold">{organization?.name}</p>
						<p className="text-xs text-muted-foreground mt-1">
							ID: {organization?.org_id}
						</p>
					</div>

					<p className="text-sm text-muted-foreground">
						This action cannot be undone. The organization and all its
						associated data will be permanently deleted.
					</p>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							Cancel
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
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
