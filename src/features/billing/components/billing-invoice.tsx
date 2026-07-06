import { format, subDays } from "date-fns";
import { CircleCheckBig, Eye, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DateRange } from "react-day-picker";

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
import DashboardTimeRangePicker from "@/features/dashboard/components/dashboard-time-range-picker";

import type {
	Invoice,
	InvoiceDetails,
	InvoiceDetailsResponse,
} from "../billing.type";
import InvoiceStatusConfirmDialog from "./dialogs/invoice-status-confirm-dialog";
import ViewInvoiceDetailsDialog from "./dialogs/view-invoice-details-dialog";
import { useGetInvoices } from "../hooks/use-get-invoices";
import { useMarkInvoiceAsPaid } from "../hooks/use-mark-invoice-as-paid";
import { useMarkInvoiceAsRefunded } from "../hooks/use-mark-invoice-as-refunded";
import { itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useAdminOrganizationDetailsStore } from "@/features/admin-organization-details/store/admin-organization-details";

const BillingInvoice = (): React.JSX.Element => {
	const { t } = useTranslation("billing");

	const { orgId } = useParams<{
		orgId: string;
	}>();
	const storedOrganizationId = useAdminOrganizationDetailsStore(
		(state) => state.organizationId
	);

	const [paidFilter, setPaidFilter] = useState<"all" | "true" | "false">("all");
	const [limit, setLimit] = useState(10);
	const [detailsInvoiceResponse, setDetailsInvoiceResponse] =
		useState<InvoiceDetailsResponse | null>(null);
	const [paidInvoice, setPaidInvoice] = useState<InvoiceDetails | null>(null);
	const [refundedInvoice, setRefundedInvoice] = useState<InvoiceDetails | null>(
		null
	);
	const defaultDateRange = useMemo<DateRange>(
		() => ({
			from: subDays(new Date(), 30),
			to: new Date(),
		}),
		[]
	);
	const [dateRange, setDateRange] = useState<DateRange | undefined>(
		defaultDateRange
	);

	const paid = paidFilter === "all" ? undefined : paidFilter === "true";
	const fromDate = dateRange?.from
		? format(dateRange.from, "yyyy-MM-dd")
		: undefined;
	const toDate = dateRange?.from
		? format(dateRange.to ?? dateRange.from, "yyyy-MM-dd")
		: undefined;

	const { mutate: markInvoiceAsPaid, isPending: isMarkInvoiceAsPaidPending } =
		useMarkInvoiceAsPaid();
	const {
		mutate: markInvoiceAsRefunded,
		isPending: isMarkInvoiceAsRefundedPending,
	} = useMarkInvoiceAsRefunded();

	const { data: invoices } = useGetInvoices({
		offset: 0,
		limit,
		paid,
		from_date: fromDate,
		to_date: toDate,
		org_id: storedOrganizationId || orgId || "",
	});

	const rows = invoices?.data ?? [];
	const total = invoices?.total ?? 0;
	const hasMore = rows.length < total;

	const toInvoiceDetails = (invoice: Invoice): InvoiceDetails => ({
		...invoice,
		line_items: [],
	});

	const handleMarkAsPaid = (invoice: InvoiceDetails) => {
		markInvoiceAsPaid(
			{ invoiceId: invoice.invoice_uid },
			{
				onSuccess: () => {
					setPaidInvoice(null);
				},
			}
		);
	};

	const handleMarkAsRefunded = (invoice: InvoiceDetails) => {
		markInvoiceAsRefunded(
			{ invoiceId: invoice.invoice_uid },
			{
				onSuccess: () => {
					setRefundedInvoice(null);
				},
			}
		);
	};

	return (
		<motion.div
			className="space-y-4"
			variants={itemVariants}
			initial="hidden"
			animate="visible"
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
				<DashboardTimeRangePicker
					date={dateRange}
					onDateRangeChange={setDateRange}
					className="mx-0"
				/>
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
						<TableHead className="text-right">
							{t("invoice.table.columns.actions")}
						</TableHead>
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
						rows.map((invoice: Invoice) => (
							<TableRow key={invoice.invoice_uid}>
								<TableCell className="font-medium">
									{invoice.invoice_uid}
								</TableCell>
								<TableCell>{invoice.billing_period}</TableCell>
								<TableCell>{invoice.total_amount}</TableCell>
								<TableCell>{invoice.paid_at || "-"}</TableCell>
								<TableCell>{invoice.used_credits}</TableCell>
								<TableCell>
									<div className="flex flex-wrap justify-end gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												setDetailsInvoiceResponse({
													success: true,
													results: toInvoiceDetails(invoice),
												})
											}
										>
											<Eye className="h-4 w-4" />
											{t("dialogs.invoiceActions.viewDetails")}
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => setPaidInvoice(toInvoiceDetails(invoice))}
											disabled={!!invoice.paid_at}
										>
											<CircleCheckBig className="h-4 w-4" />
											{t("dialogs.invoiceActions.markAsPaid")}
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												setRefundedInvoice(toInvoiceDetails(invoice))
											}
										>
											<RotateCcw className="h-4 w-4" />
											{t("dialogs.invoiceActions.markAsRefunded")}
										</Button>
									</div>
								</TableCell>
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

			<ViewInvoiceDetailsDialog
				open={detailsInvoiceResponse !== null}
				onOpenChange={(open) => {
					if (!open) {
						setDetailsInvoiceResponse(null);
					}
				}}
				invoiceResponse={detailsInvoiceResponse}
			/>

			<InvoiceStatusConfirmDialog
				open={paidInvoice !== null}
				onOpenChange={(open) => {
					if (!open) {
						setPaidInvoice(null);
					}
				}}
				invoice={paidInvoice}
				title={t("dialogs.invoiceStatus.paid.title")}
				description={t("dialogs.invoiceStatus.paid.description")}
				confirmLabel={t("dialogs.invoiceStatus.paid.confirm")}
				isPending={isMarkInvoiceAsPaidPending}
				onConfirm={handleMarkAsPaid}
				confirmVariant="default"
				leadingIcon={<CircleCheckBig className="h-4 w-4" />}
			/>

			<InvoiceStatusConfirmDialog
				open={refundedInvoice !== null}
				onOpenChange={(open) => {
					if (!open) {
						setRefundedInvoice(null);
					}
				}}
				invoice={refundedInvoice}
				title={t("dialogs.invoiceStatus.refunded.title")}
				description={t("dialogs.invoiceStatus.refunded.description")}
				confirmLabel={t("dialogs.invoiceStatus.refunded.confirm")}
				isPending={isMarkInvoiceAsRefundedPending}
				onConfirm={handleMarkAsRefunded}
				confirmVariant="default"
				leadingIcon={<RotateCcw className="h-4 w-4" />}
			/>
		</motion.div>
	);
};

export default BillingInvoice;
