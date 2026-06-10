import { Button } from "@/components/shadcn/button";
import { Spinner } from "@/components/shadcn/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/table";
import type { Transaction } from "@/features/billing/billing.type";
import { CopyIcon, EyeIcon } from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import TransactionReceiptDialog from "./transaction-receipt-dialog";

type TransactionsTableProps = {
	rows: Transaction[];
	isLoading: boolean;
	isError: boolean;
	organizationCredits: number;
	onCopyTransactionId: (transactionId: string) => void;
};

const badgeBaseClass =
	"inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium";

const TransactionsTable = ({
	rows,
	isLoading,
	isError,
	organizationCredits,
	onCopyTransactionId,
}: TransactionsTableProps): React.JSX.Element => {
	const { t, i18n } = useTranslation("billing");
	const currentLocale = i18n.language;

	const renderStatus = (status: Transaction["status"]) => {
		switch (status) {
			case "CAPTURED":
				return (
					<span
						className={`${badgeBaseClass} border-emerald-500 text-emerald-700 bg-white`}
					>
						{t("overview.statusOptions.CAPTURED")}
					</span>
				);
			case "EXPIRED":
				return (
					<span
						className={`${badgeBaseClass} border-red-500 text-red-600 bg-white`}
					>
						{t("overview.statusOptions.EXPIRED")}
					</span>
				);
			case "PENDING":
				return (
					<span
						className={`${badgeBaseClass} border-amber-500 text-amber-700 bg-white`}
					>
						{t("overview.statusOptions.PENDING")}
					</span>
				);
			default:
				return (
					<span
						className={`${badgeBaseClass} border-slate-400 text-slate-700 bg-white`}
					>
						{status}
					</span>
				);
		}
	};

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t("overview.table.columns.date")}</TableHead>
						<TableHead>{t("overview.table.columns.transactionId")}</TableHead>
						<TableHead className="text-center">
							{t("overview.table.columns.amount")}
						</TableHead>
						<TableHead>{t("overview.table.columns.status")}</TableHead>
						<TableHead>{t("overview.table.columns.credits")}</TableHead>
						<TableHead>{t("overview.table.columns.projectUid")}</TableHead>
						<TableHead className="text-right">
							{t("overview.table.columns.action")}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={7} className="py-8">
								<div className="flex items-center justify-center gap-2 text-muted-foreground">
									<Spinner />
									<span>{t("overview.table.loading")}</span>
								</div>
							</TableCell>
						</TableRow>
					) : isError ? (
						<TableRow>
							<TableCell
								colSpan={7}
								className="py-6 text-center text-destructive"
							>
								{t("overview.table.error")}
							</TableCell>
						</TableRow>
					) : rows.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={7}
								className="py-6 text-center text-muted-foreground"
							>
								{t("overview.table.empty")}
							</TableCell>
						</TableRow>
					) : (
						rows.map((transaction) => {
							const createdAt = new Date(transaction.captured_at);

							return (
								<TableRow key={transaction.transaction_uid}>
									<TableCell>
										{Number.isNaN(createdAt.getTime())
											? "-"
											: createdAt.toLocaleString(currentLocale)}
									</TableCell>
									<TableCell className="text-muted-foreground text-xs font-medium">
										{transaction.transaction_uid}
									</TableCell>
									<TableCell className="text-center font-medium">
										{new Intl.NumberFormat(currentLocale, {
											style: "currency",
											currency: "USD",
										}).format(Number(transaction.amount ?? 0))}
									</TableCell>
									<TableCell>{renderStatus(transaction.status)}</TableCell>
									<TableCell className="text-left font-medium text-emerald-600">
										+
										{Number(organizationCredits ?? 0).toLocaleString(
											currentLocale
										)}
									</TableCell>
									<TableCell className="max-w-56 truncate text-muted-foreground">
										{transaction.project_uid || "-"}
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-end gap-1">
											<TransactionReceiptDialog
												transaction={transaction}
												triggerElement={
													<Button type="button" variant="ghost" size="icon-sm">
														<EyeIcon className="size-4" />
													</Button>
												}
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												onClick={() =>
													onCopyTransactionId(transaction.transaction_uid)
												}
											>
												<CopyIcon className="size-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
};

export default TransactionsTable;
