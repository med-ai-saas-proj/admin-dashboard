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
import { useState } from "react";
import { useCreateAdminOrganization } from "../../hooks/use-create-admin-organizations";
import { useGetAdminOrganizations } from "../../hooks/use-get-admin-organizations";

interface CreateAdminOrganizationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const CreateAdminOrganizationDialog = ({
	open,
	onOpenChange,
}: CreateAdminOrganizationDialogProps) => {
	const { t } = useTranslation("admin-organization");

	const [name, setName] = useState("");
	const [alias, setAlias] = useState("");
	const [ownerId, setOwnerId] = useState("");

	const { mutate: createOrganization, isPending } =
		useCreateAdminOrganization();
	const { refetch } = useGetAdminOrganizations();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error(t("create.messages.validationError"));
			return;
		}

		createOrganization(
			{
				name: name.trim(),
				alias: alias.trim() || null,
				owner_id: ownerId.trim() || null,
			},
			{
				onSuccess: () => {
					toast.success(t("create.messages.success"));
					setName("");
					setAlias("");
					setOwnerId("");
					onOpenChange(false);
					refetch();
				},
				onError: () => {
					toast.error(t("create.messages.error"));
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("create.dialog.title")}</DialogTitle>
					<DialogDescription>
						{t("create.dialog.description")}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">
							{t("create.form.labels.organizationName")}
						</Label>
						<Input
							id="name"
							placeholder={t("create.form.placeholders.organizationName")}
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="alias">{t("create.form.labels.alias")}</Label>
						<Input
							id="alias"
							placeholder={t("create.form.placeholders.alias")}
							value={alias}
							onChange={(e) => setAlias(e.target.value)}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="owner-id">{t("create.form.labels.ownerId")}</Label>
						<Input
							id="owner-id"
							placeholder={t("create.form.placeholders.ownerId")}
							value={ownerId}
							onChange={(e) => setOwnerId(e.target.value)}
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
							{t("create.buttons.cancel")}
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Spinner className="mr-2 h-4 w-4" />
									{t("create.buttons.creating")}
								</>
							) : (
								t("create.buttons.create")
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
