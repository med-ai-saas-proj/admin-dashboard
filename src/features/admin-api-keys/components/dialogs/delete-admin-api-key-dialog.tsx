import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { useTranslation } from "react-i18next";
import { useDeleteAdminApiKey } from "../../hooks/use-delete-admin-api-key";
import { toast } from "sonner";

const DeleteAdminApiKeyDialog = ({ open, onOpenChange, apiKey }: any) => {
	const { t } = useTranslation("admin-api-key");
	const projectId = apiKey?.project_uuid || "";
	const deleteMutation = useDeleteAdminApiKey(projectId);

	const handleDelete = () => {
		if (!apiKey) return;

		deleteMutation.mutate(
			{ apiKeyId: apiKey.api_key_uuid },
			{
				onSuccess: () => {
					toast.success(t("common.toast.deleteSuccess"));
					onOpenChange(false);
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<span />
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t("delete.dialog.title")}</DialogTitle>
				</DialogHeader>

				<div className="text-sm text-slate-700">
					{t("delete.message")}
					<div className="mt-3 font-mono text-xs text-slate-800">
						{apiKey?.api_key_uuid}
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost" disabled={deleteMutation.isPending}>
							{t("delete.buttons.cancel")}
						</Button>
					</DialogClose>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending
							? t("delete.buttons.deleting")
							: t("delete.buttons.delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteAdminApiKeyDialog;
