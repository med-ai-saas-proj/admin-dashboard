import type { ComponentProps, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcn/dialog";
import { Spinner } from "@/components/shadcn/spinner";
import type { InvoiceDetails } from "../../billing.type";

type InvoiceStatusConfirmDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	invoice: InvoiceDetails | null;
	title: string;
	description: string;
	confirmLabel: string;
	isPending: boolean;
	onConfirm: (invoice: InvoiceDetails) => void;
	confirmVariant?: ComponentProps<typeof Button>["variant"];
	leadingIcon?: ReactNode;
};

const InvoiceStatusConfirmDialog = ({
	open,
	onOpenChange,
	invoice,
	title,
	description,
	confirmLabel,
	isPending,
	onConfirm,
	confirmVariant = "default",
	leadingIcon,
}: InvoiceStatusConfirmDialogProps) => {
	const { t } = useTranslation("billing");
	const { t: tCommon } = useTranslation("common");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 rounded-lg border bg-muted/30 p-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							{t("dialogs.invoiceStatus.labels.invoiceUid")}
						</p>
						<p className="text-sm font-medium wrap-break-word">
							{invoice?.invoice_uid || "-"}
						</p>
					</div>
					<div>
						<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							{t("dialogs.invoiceStatus.labels.billingPeriod")}
						</p>
						<p className="text-sm font-medium wrap-break-word">
							{invoice?.billing_period || "-"}
						</p>
					</div>
					<div>
						<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							{t("dialogs.invoiceStatus.labels.totalAmount")}
						</p>
						<p className="text-sm font-medium wrap-break-word">
							{invoice?.total_amount || "-"}
						</p>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" disabled={isPending}>
							{tCommon("action.cancel")}
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant={confirmVariant}
						disabled={isPending || !invoice}
						onClick={() => {
							if (!invoice) {
								return;
							}

							onConfirm(invoice);
						}}
					>
						{isPending ? <Spinner className="h-4 w-4" /> : leadingIcon}
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default InvoiceStatusConfirmDialog;
