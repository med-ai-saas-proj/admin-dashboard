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
import { useState } from "react";
import { useDeleteAdminApiKey } from "../../hooks/use-delete-admin-api-key";

const DeleteAdminApiKeyDialog = ({ open, onOpenChange, apiKey }: any) => {
	const [isLoading, setIsLoading] = useState(false);
	const { t } = useTranslation("admin-api-key");
	const projectId = apiKey?.project_uuid || "";
	const deleteMutation = useDeleteAdminApiKey(projectId);

	const handleDelete = async () => {
		if (!apiKey) return;

		setIsLoading(true);
		try {
			await deleteMutation.mutateAsync({
				apiKeyId: apiKey.api_key_uuid,
			});
			onOpenChange(false);
		} finally {
			setIsLoading(false);
		}
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
						<Button
							variant="ghost"
							disabled={isLoading || deleteMutation.isPending}
						>
							{t("delete.buttons.cancel")}
						</Button>
					</DialogClose>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isLoading || deleteMutation.isPending}
					>
						{isLoading || deleteMutation.isPending
							? t("delete.buttons.deleting")
							: t("delete.buttons.delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteAdminApiKeyDialog;
