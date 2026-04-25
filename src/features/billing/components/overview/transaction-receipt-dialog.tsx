import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/dialog";
import type { Transactions } from "@/features/billing/billing.type";
import type React from "react";
import { useTranslation } from "react-i18next";

type TransactionReceiptDialogProps = {
	transaction: Transactions;
	triggerElement: React.ReactNode;
};

const TransactionReceiptDialog = ({
	transaction,
	triggerElement,
}: TransactionReceiptDialogProps): React.JSX.Element => {
	const { t, i18n } = useTranslation("billing");
	const currentLocale = i18n.language === "vi" ? "vi-VN" : "en-US";
	const createdAt = new Date(transaction.createdAt);
	const errorMessage =
		(transaction as { errorMessage?: string | null }).errorMessage ?? "-";

	return (
		<Dialog>
			<DialogTrigger asChild>{triggerElement}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("overview.receiptDialog.title")}</DialogTitle>
					<DialogDescription>
						{t("overview.receiptDialog.description")}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 text-sm">
					<div className="rounded-md border p-3">
						<p className="text-muted-foreground text-xs">
							{t("overview.receiptDialog.fields.transactionId")}
						</p>
						<p className="font-medium break-all">{transaction.transactionId}</p>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div className="rounded-md border p-3">
							<p className="text-muted-foreground text-xs">
								{t("overview.receiptDialog.fields.type")}
							</p>
							<p className="font-medium">{transaction.type}</p>
						</div>
						<div className="rounded-md border p-3">
							<p className="text-muted-foreground text-xs">
								{t("overview.receiptDialog.fields.status")}
							</p>
							<p className="font-medium">{transaction.status}</p>
						</div>
						<div className="rounded-md border p-3">
							<p className="text-muted-foreground text-xs">
								{t("overview.receiptDialog.fields.amount")}
							</p>
							<p className="font-medium">
								{new Intl.NumberFormat(currentLocale, {
									style: "currency",
									currency: "USD",
								}).format(Number(transaction.amount ?? 0))}
							</p>
						</div>
						<div className="rounded-md border p-3">
							<p className="text-muted-foreground text-xs">
								{t("overview.receiptDialog.fields.date")}
							</p>
							<p className="font-medium">
								{Number.isNaN(createdAt.getTime())
									? "-"
									: createdAt.toLocaleString(currentLocale)}
							</p>
						</div>
					</div>
					<div className="rounded-md border p-3">
						<p className="text-muted-foreground text-xs">
							{t("overview.receiptDialog.fields.invoiceRef")}
						</p>
						<p className="font-medium break-all">
							{transaction.invoiceId || "-"}
						</p>
					</div>
					<div className="rounded-md border p-3">
						<p className="text-muted-foreground text-xs">
							{t("overview.receiptDialog.fields.failureReason")}
						</p>
						<p className="text-destructive break-all">
							{transaction.status === "FAILED" ? errorMessage : "-"}
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default TransactionReceiptDialog;
