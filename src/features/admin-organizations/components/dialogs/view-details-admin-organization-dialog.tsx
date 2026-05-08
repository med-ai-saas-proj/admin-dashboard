import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcn/dialog";
import { Spinner } from "@/components/shadcn/spinner";
import { useGetAdminOrganizationDetails } from "../../hooks/use-get-admin-organizations-details";
import type { AdminOrganization } from "../../types/admin-organizations";

interface ViewDetailsAdminOrganizationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organization: AdminOrganization | null;
}

export const ViewDetailsAdminOrganizationDialog = ({
	open,
	onOpenChange,
	organization,
}: ViewDetailsAdminOrganizationDialogProps) => {
	const { data, isLoading } = useGetAdminOrganizationDetails(
		{
			organization_id: organization?.org_id || "",
		},
		{
			enabled: open && !!organization,
		}
	);

	const details = data?.data?.[0] || organization;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Organization Details</DialogTitle>
					<DialogDescription>
						View detailed information about this organization
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="flex justify-center py-6">
						<Spinner className="h-6 w-6" />
					</div>
				) : (
					<div className="space-y-4">
						<div>
							<p className="text-sm font-semibold text-muted-foreground">
								Organization ID
							</p>
							<p className="text-sm mt-1">{details?.org_id}</p>
						</div>

						<div>
							<p className="text-sm font-semibold text-muted-foreground">
								Organization Name
							</p>
							<p className="text-sm mt-1">{details?.name}</p>
						</div>

						<div>
							<p className="text-sm font-semibold text-muted-foreground">
								Owner ID
							</p>
							<p className="text-sm mt-1">{details?.owner_id || "N/A"}</p>
						</div>
					</div>
				)}

				<div className="flex justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
