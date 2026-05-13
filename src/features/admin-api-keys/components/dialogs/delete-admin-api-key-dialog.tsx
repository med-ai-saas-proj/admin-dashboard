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

const DeleteAdminApiKeyDialog = ({ open, onOpenChange, apiKey }: any) => {
	const handleDelete = async () => {
		// Placeholder: call delete mutation when implemented
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<span />
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Archive API Key</DialogTitle>
				</DialogHeader>

				<div className="text-sm text-slate-700">
					Are you sure you want to archive this API key? This action can be
					reversed.
					<div className="mt-3 font-mono text-xs text-slate-800">
						{apiKey?.api_key_uuid}
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost">Cancel</Button>
					</DialogClose>
					<Button variant="destructive" onClick={handleDelete}>
						Archive
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteAdminApiKeyDialog;
