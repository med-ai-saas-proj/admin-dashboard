import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose,
	DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";

const ViewAdminApiKeyDialog = ({ open, onOpenChange, apiKey }: any) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<span />
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>API Key Details</DialogTitle>
					<DialogDescription>
						{apiKey ? (
							<div className="space-y-3 text-sm text-slate-700">
								<div>
									<div className="text-sm text-slate-500">UUID</div>
									<div className="font-mono text-slate-800">
										{apiKey.api_key_uuid}
									</div>
								</div>
								<div>
									<div className="text-sm text-slate-500">Name</div>
									<div className="font-medium">{apiKey.name}</div>
								</div>
								<div>
									<div className="text-sm text-slate-500">Description</div>
									<div>{apiKey.description ?? "-"}</div>
								</div>
								<div>
									<div className="text-sm text-slate-500">Permissions</div>
									<div className="flex flex-wrap gap-2 mt-1">
										{(apiKey.permissions || []).map((p: string, i: number) => (
											<span
												key={i}
												className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 text-[11px]"
											>
												{p}
											</span>
										))}
									</div>
								</div>
							</div>
						) : (
							<div className="text-sm text-slate-600">No API key selected.</div>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 flex justify-end">
					<DialogClose asChild>
						<Button variant="default">Close</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ViewAdminApiKeyDialog;
