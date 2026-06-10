import { useTranslation } from "react-i18next";

import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcn/dialog";
import type {
	InvoiceDetails,
	InvoiceDetailsResponse,
} from "../../billing.type";

type ViewInvoiceDetailsDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	invoiceResponse: InvoiceDetailsResponse | null;
};

const ViewInvoiceDetailsDialog = ({
	open,
	onOpenChange,
	invoiceResponse,
}: ViewInvoiceDetailsDialogProps) => {
	const { t } = useTranslation("billing");
	const { t: tCommon } = useTranslation("common");

	const invoice: InvoiceDetails | null = invoiceResponse?.results ?? null;

	const fields = invoice
		? [
				{
					label: t("dialogs.invoiceDetails.fields.invoiceUid"),
					value: invoice.invoice_uid,
				},
				{
					label: t("dialogs.invoiceDetails.fields.billingPeriod"),
					value: invoice.billing_period,
				},
				{
					label: t("dialogs.invoiceDetails.fields.totalAmount"),
					value: invoice.total_amount,
				},
				{
					label: t("dialogs.invoiceDetails.fields.paidAt"),
					value: invoice.paid_at || "-",
				},
				{
					label: t("dialogs.invoiceDetails.fields.usedCredits"),
					value: invoice.used_credits,
				},
			]
		: [];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>{t("dialogs.invoiceDetails.title")}</DialogTitle>
					<DialogDescription>
						{t("dialogs.invoiceDetails.description")}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-3 sm:grid-cols-2">
					{fields.map((field) => (
						<div key={field.label} className="space-y-1 rounded-lg border p-3">
							<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
								{field.label}
							</p>
							<p className="text-sm font-medium break-words">{field.value}</p>
						</div>
					))}
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						{tCommon("action.cancel")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ViewInvoiceDetailsDialog;
