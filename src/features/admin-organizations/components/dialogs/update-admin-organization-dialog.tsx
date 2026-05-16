import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Spinner } from "@/components/shadcn/spinner";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useUpdateAdminOrganization } from "../../hooks/use-update-admin-organizations";
import { useGetAdminOrganizations } from "../../hooks/use-get-admin-organizations";
import type { AdminOrganization } from "../../types/admin-organizations";

interface UpdateAdminOrganizationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organization: AdminOrganization | null;
}

export const UpdateAdminOrganizationDialog = ({
	open,
	onOpenChange,
	organization,
}: UpdateAdminOrganizationDialogProps) => {
	const { t } = useTranslation("admin-organization");

	const [name, setName] = useState("");

	const { mutate: updateOrganization, isPending } =
		useUpdateAdminOrganization();
	const { refetch } = useGetAdminOrganizations();

	useEffect(() => {
		if (organization) {
			setName(organization.name);
		}
	}, [organization]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !organization) {
			toast.error(t("update.messages.validationError"));
			return;
		}

		updateOrganization(
			{
				organization_id: organization.org_id,
				name: name.trim(),
			},
			{
				onSuccess: () => {
					toast.success(t("update.messages.success"));
					onOpenChange(false);
					refetch();
				},
				onError: () => {
					toast.error(t("update.messages.error"));
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("update.dialog.title")}</DialogTitle>
					<DialogDescription>
						{t("update.dialog.description")}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">
							{t("update.form.labels.organizationName")}
						</Label>
						<Input
							id="name"
							placeholder={t("update.form.placeholders.organizationName")}
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isPending}
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							{t("create.action.cancel") ||
								t("common.action.cancel") ||
								"Cancel"}
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Spinner className="mr-2 h-4 w-4" />
									{t("update.buttons.updating")}
								</>
							) : (
								t("update.buttons.update")
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
