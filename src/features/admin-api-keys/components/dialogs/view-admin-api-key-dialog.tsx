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
import { useTranslation } from "react-i18next";

const ViewAdminApiKeyDialog = ({ open, onOpenChange, apiKey }: any) => {
	const { t } = useTranslation("admin-api-key");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<span />
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t("view.dialog.title")}</DialogTitle>
					<DialogDescription>
						{apiKey ? (
							<div className="space-y-3 text-sm text-slate-700">
								<div>
									<div className="text-sm text-slate-500">
										{t("view.labels.uuid")}
									</div>
									<div className="font-mono text-slate-800">
										{apiKey.api_key_uuid}
									</div>
								</div>
								<div>
									<div className="text-sm text-slate-500">
										{t("view.labels.name")}
									</div>
									<div className="font-medium">{apiKey.name}</div>
								</div>
								<div>
									<div className="text-sm text-slate-500">
										{t("view.labels.description")}
									</div>
									<div>{apiKey.description ?? t("common.notAvailable")}</div>
								</div>
								<div>
									<div className="text-sm text-slate-500">
										{t("view.labels.permissions")}
									</div>
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
							<div className="text-sm text-slate-600">{t("view.empty")}</div>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 flex justify-end">
					<DialogClose asChild>
						<Button variant="default">{t("view.buttons.close")}</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ViewAdminApiKeyDialog;
