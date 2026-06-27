import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcn/dialog";
import { Spinner } from "@/components/shadcn/spinner";
import { useTranslation } from "react-i18next";
import { useGetAdminOrganizationDetails } from "../../hooks/use-get-admin-organizations-details";
import type { AdminOrganization } from "../../types/admin-organizations";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth-store";

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
	const { t } = useTranslation("admin-organization");

	const navigate = useNavigate();
	const setOrganization = useAuthStore((state) => state.setOrganization);
	const { data, isLoading } = useGetAdminOrganizationDetails(
		{
			organization_id: organization?.org_id || "",
		},
		{
			enabled: open && !!organization,
		}
	);

	const details = data?.results || organization;

	const handleNavigateToDetails = (orgName: string, orgId: string) => {
		setOrganization({
			name: orgName,
			id: orgId,
		});
		navigate(`/organizations/${orgId}`);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("details.dialog.title")}</DialogTitle>
					<DialogDescription>
						{t("details.dialog.description")}
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
								{t("details.labels.organizationId")}
							</p>
							<p className="text-sm mt-1">{details?.org_id}</p>
						</div>

						<div>
							<p className="text-sm font-semibold text-muted-foreground">
								{t("details.labels.organizationName")}
							</p>
							<p className="text-sm mt-1">{details?.name}</p>
						</div>

						<div>
							<p className="text-sm font-semibold text-muted-foreground">
								{t("details.labels.ownerId")}
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
						{t("details.buttons.close")}
					</Button>
					<Button
						type="button"
						className="ml-2"
						onClick={() =>
							handleNavigateToDetails(
								details?.name || "",
								details?.org_id || ""
							)
						}
						disabled={!details}
					>
						{t("details.buttons.viewMore")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
