import { useMemo, useState } from "react";
import { useGetLifetimeValue } from "@/features/billing/hooks/use-get-lifetime-value";
import KPICard from "./kpi-card";
import type { ChartConfiguration, StatCardData } from "../dashboard.type";
import { useGetTransactions } from "@/features/billing/hooks/use-get-transactions";
import type { ChartConfig } from "@/components/shadcn/chart";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/select";
import DashboardTimeRangePicker from "./dashboard-time-range-picker";
import DashboardChart from "./dashboard-chart";
import type { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { useTranslation } from "react-i18next";

type BillingTypeFilter = "ALL" | "SUBSCRIPTION_FEE" | "TOPUP";

const DashboardBilling = (): React.JSX.Element => {
	const { t, i18n } = useTranslation("dashboard");
	const { data: lifetimeValue } = useGetLifetimeValue();
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
	const [typeFilter, setTypeFilter] = useState<BillingTypeFilter>("ALL");

	const transactionQueryParams = useMemo(() => {
		const params: {
			page: number;
			per_page: number;
			start_date?: string;
			end_date?: string;
			type?: "TOPUP" | "SUBSCRIPTION_FEE";
		} = {
			page: 1,
			per_page: 500,
		};

		if (dateRange?.from) {
			params.start_date = format(dateRange.from, "yyyy-MM-dd");
			params.end_date = format(dateRange.to ?? dateRange.from, "yyyy-MM-dd");
		}

		if (typeFilter !== "ALL") {
			params.type = typeFilter;
		}

		return params;
	}, [dateRange, typeFilter]);

	const {
		data: transactions,
		isLoading: isTransactionsLoading,
		isError: isTransactionsError,
	} = useGetTransactions(transactionQueryParams);

	const kpiData: StatCardData[] | undefined = useMemo(() => {
		if (lifetimeValue !== undefined) {
			return [
				{
					id: "Lifetime Revenue",
					title: "lifetimeRevenue",
					value: lifetimeValue.results.lifetimeRevenue,
					format: "currency",
				},
				{
					id: "Total Successful Transactions",
					title: "totalSuccessfulTransactions",
					value: lifetimeValue.results.totalSuccessfulTransactions,
					format: "compact",
				},
				{
					id: "Total Refunded Amount",
					title: "totalRefundedAmount",
					value: lifetimeValue.results.totalRefundedAmount,
					format: "currency",
				},
				{
					id: "Current Outstanding Balance",
					title: "currentOutstandingBalance",
					value: lifetimeValue.results.currentOutstandingBalance,
					format: "currency",
				},
			] as StatCardData[];
		}
	}, [lifetimeValue]);

	const billingRevenueStackConfig = {
		subscriptionFee: {
			label: t("chart.series.subscriptionFee"),
			color: "var(--chart-1)",
		},
		topup: {
			label: t("chart.series.topup"),
			color: "var(--chart-2)",
		},
	} satisfies ChartConfig;

	const chartSeries = useMemo(() => {
		if (typeFilter === "SUBSCRIPTION_FEE") {
			return [
				{
					dataKey: "subscriptionFee",
					name: "subscriptionFee",
					yAxisId: "left" as const,
					stroke: "var(--chart-1)",
					stackId: "stack",
				},
			];
		}

		if (typeFilter === "TOPUP") {
			return [
				{
					dataKey: "topup",
					name: "topup",
					yAxisId: "left" as const,
					stroke: "var(--chart-2)",
					stackId: "stack",
				},
			];
		}

		return [
			{
				dataKey: "subscriptionFee",
				name: "subscriptionFee",
				yAxisId: "left" as const,
				stroke: "var(--chart-1)",
				stackId: "amount",
			},
			{
				dataKey: "topup",
				name: "topup",
				yAxisId: "left" as const,
				stroke: "var(--chart-2)",
				stackId: "amount",
			},
		];
	}, [typeFilter]);

	const normalizedTransactionsData = useMemo(() => {
		if (!transactions) return [];

		return transactions.results.map((tx) => ({
			date: tx.createdAt.toLocaleString().slice(0, 10), // Extract YYYY-MM-DD from ISO string
		}));
	}, [transactions]);

	const billingRevenueChart: ChartConfiguration = {
		title: "billingRevenueMix",
		config: billingRevenueStackConfig,
		xKey: "date",
		series: chartSeries,
		datasets: normalizedTransactionsData ?? [],
		chartType: "bar",
	};

	const formatUsdTick = (value: number) =>
		new Intl.NumberFormat(i18n.language === "vi" ? "vi-VN" : "en-US", {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(value);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-end gap-x-4">
				{kpiData !== undefined ? (
					kpiData.map((kpi) => <KPICard key={kpi.id} data={kpi} />)
				) : (
					<p>{t("billing.states.noData")}</p>
				)}
			</div>
			<div className="space-y-4">
				<div className="flex flex-col md:flex-row md:items-end md:justify-end gap-4">
					<div className="flex flex-col gap-y-2">
						<p className="text-sm font-medium">
							{t("billing.filters.type.label")}
						</p>
						<Select
							value={typeFilter}
							onValueChange={(value) =>
								setTypeFilter(value as BillingTypeFilter)
							}
						>
							<SelectTrigger className="w-[220px]">
								<SelectValue
									placeholder={t("billing.filters.type.placeholder")}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>
										{t("billing.filters.type.transactionTypeLabel")}
									</SelectLabel>
									<SelectItem value="ALL">
										{t("billing.filters.type.options.all")}
									</SelectItem>
									<SelectItem value="SUBSCRIPTION_FEE">
										{t("billing.filters.type.options.subscriptionFee")}
									</SelectItem>
									<SelectItem value="TOPUP">
										{t("billing.filters.type.options.topup")}
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-y-2">
						<p className="text-sm font-medium">
							{t("billing.filters.timeRange")}
						</p>
						<DashboardTimeRangePicker
							defaultDate={defaultDateRange}
							date={dateRange}
							onDateRangeChange={setDateRange}
						/>
					</div>
				</div>

				{isTransactionsLoading ? (
					<div className="text-sm text-muted-foreground">
						{t("billing.states.loadingChart")}
					</div>
				) : isTransactionsError ? (
					<div className="text-sm text-destructive">
						{t("billing.states.loadError")}
					</div>
				) : (
					<DashboardChart
						title={t("chart.billingRevenueMix")}
						chartConfig={billingRevenueChart}
						yTickFormatter={formatUsdTick}
					/>
				)}
			</div>
		</div>
	);
};

export default DashboardBilling;
