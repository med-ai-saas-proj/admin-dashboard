import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/select";
import { Button } from "@/components/shadcn/button";

import { useGetInvoices } from "../hooks/use-get-invoices";

const BillingInvoice = (): React.JSX.Element => {
	const { t } = useTranslation("billing");
	const [paidFilter, setPaidFilter] = useState<"all" | "true" | "false">("all");
	const [limit, setLimit] = useState(10);

	const paid = paidFilter === "all" ? undefined : paidFilter === "true";

	const { data: invoices } = useGetInvoices({
		offset: 0,
		limit,
		paid,
	});

	const rows = invoices?.data ?? [];
	const total = invoices?.total ?? 0;
	const hasMore = rows.length < total;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-end">
				<Select
					value={paidFilter}
					onValueChange={(value) => setPaidFilter(value as typeof paidFilter)}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder={t("invoice.toolbar.filterPaid")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t("invoice.toolbar.all")}</SelectItem>
						<SelectItem value="true">{t("invoice.toolbar.paid")}</SelectItem>
						<SelectItem value="false">{t("invoice.toolbar.unpaid")}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t("invoice.table.columns.invoiceUid")}</TableHead>
						<TableHead>{t("invoice.table.columns.billingPeriod")}</TableHead>
						<TableHead>{t("invoice.table.columns.totalAmount")}</TableHead>
						<TableHead>{t("invoice.table.columns.paidAt")}</TableHead>
						<TableHead>{t("invoice.table.columns.usedCredits")}</TableHead>
						<TableHead>{t("invoice.table.columns.details")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={6}
								className="py-6 text-center text-muted-foreground"
							>
								{t("invoice.table.empty")}
							</TableCell>
						</TableRow>
					) : (
						rows.map((invoice) => (
							<TableRow key={invoice.invoice_uid}>
								<TableCell className="font-medium">
									{invoice.invoice_uid}
								</TableCell>
								<TableCell>{invoice.billing_period}</TableCell>
								<TableCell>{invoice.total_amount}</TableCell>
								<TableCell>{invoice.paid_at || "-"}</TableCell>
								<TableCell>{invoice.used_credits}</TableCell>
								<TableCell>{invoice.details.additionalProperty}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			<div className="flex justify-center">
				{hasMore ? (
					<Button
						type="button"
						variant="outline"
						onClick={() => setLimit((currentLimit) => currentLimit + 10)}
					>
						{t("invoice.table.loadMore")}
					</Button>
				) : (
					<p className="text-sm text-muted-foreground">
						{t("invoice.table.endOfTable")}
					</p>
				)}
			</div>
		</div>
	);
};

export default BillingInvoice;
