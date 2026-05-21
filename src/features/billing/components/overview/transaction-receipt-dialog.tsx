import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/dialog";
import type { Transaction } from "@/features/billing/billing.type";
import type React from "react";
import { useTranslation } from "react-i18next";

type TransactionReceiptDialogProps = {
	transaction: Transaction;
	triggerElement: React.ReactNode;
};

const TransactionReceiptDialog = ({
	transaction,
	triggerElement,
}: TransactionReceiptDialogProps): React.JSX.Element => {
	const { t, i18n } = useTranslation("billing");
	const currentLocale = i18n.language === "vi" ? "vi-VN" : "en-US";
	const createdAt = new Date(transaction.captured_at);

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
						<p className="font-medium break-all">
							{transaction.transaction_uid}
						</p>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div className="rounded-md border p-3">
							<p className="text-muted-foreground text-xs">
								{t("overview.receiptDialog.fields.projectUid")}
							</p>
							<p className="font-medium break-all">
								{transaction.project_uid || "-"}
							</p>
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
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default TransactionReceiptDialog;
