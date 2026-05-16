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
import { useState } from "react";
import { useDeleteAdminApiKey } from "../../hooks/use-delete-admin-api-key";

const DeleteAdminApiKeyDialog = ({ open, onOpenChange, apiKey }: any) => {
	const [isLoading, setIsLoading] = useState(false);
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
					<DialogTitle>Delete API Key</DialogTitle>
				</DialogHeader>

				<div className="text-sm text-slate-700">
					Are you sure you want to delelte this API key? This action can not be
					reversed.
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
							Cancel
						</Button>
					</DialogClose>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isLoading || deleteMutation.isPending}
					>
						{isLoading || deleteMutation.isPending ? "Deleting..." : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteAdminApiKeyDialog;
