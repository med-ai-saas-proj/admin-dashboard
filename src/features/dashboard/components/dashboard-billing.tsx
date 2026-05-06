import { useGetLifetimeValue } from "@/features/billing/hooks/use-get-lifetime-value";
import KPICard from "./kpi-card";
import { useMemo } from "react";
import type { StatCardData } from "../dashboard.type";

const DashboardBilling = (): React.JSX.Element => {
	const { data: lifetimeValue } = useGetLifetimeValue();
	const kpiData: StatCardData[] | undefined = useMemo(() => {
		if (lifetimeValue !== undefined) {
			return [
				{
					id: "Lifetime Revenue",
					title: "lifetimeRevenue",
					value: lifetimeValue.data.lifetimeRevenue,
					format: "currency",
				},
				{
					id: "Total Successful Transactions",
					title: "totalSuccessfulTransactions",
					value: lifetimeValue.data.totalSuccessfulTransactions,
					format: "compact",
				},
				{
					id: "Total Refunded Amount",
					title: "totalRefundedAmount",
					value: lifetimeValue.data.totalRefundedAmount,
					format: "currency",
				},
				{
					id: "Current Outstanding Balance",
					title: "currentOutstandingBalance",
					value: lifetimeValue.data.currentOutstandingBalance,
					format: "currency",
				},
			] as StatCardData[];
		}
	}, [lifetimeValue]);

	return (
		<div>
			<div className="flex items-center justify-end gap-x-4">
				{kpiData !== undefined ? (
					kpiData.map((kpi) => <KPICard key={kpi.id} data={kpi} />)
				) : (
					<p>No data available</p>
				)}
			</div>
		</div>
	);
};

export default DashboardBilling;
