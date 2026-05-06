import { Button } from "@/components/shadcn/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Input } from "@/components/shadcn/input";
import DashboardTimeRangePicker from "@/features/dashboard/components/dashboard-time-range-picker";
import { FilterIcon, SearchIcon } from "lucide-react";
import type React from "react";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

export type TransactionStatusFilter =
	| "ALL"
	| "SUCCESS"
	| "FAILED"
	| "PENDING"
	| "REFUNDED";

export type TransactionTypeFilter =
	| "ALL"
	| "TOPUP"
	| "SUBSCRIPTION"
	| "SUBSCRIPTION_FEE"
	| "OVERAGE_FEE";

type TransactionsToolbarProps = {
	searchValue: string;
	statusValue: TransactionStatusFilter;
	typeValue: TransactionTypeFilter;
	dateRange?: DateRange;
	onSearchChange: (value: string) => void;
	onStatusChange: (value: TransactionStatusFilter) => void;
	onTypeChange: (value: TransactionTypeFilter) => void;
	onDateRangeChange: (value: DateRange | undefined) => void;
	onResetFilters: () => void;
};

const TransactionsToolbar = ({
	searchValue,
	statusValue,
	typeValue,
	dateRange,
	onSearchChange,
	onStatusChange,
	onTypeChange,
	onDateRangeChange,
	onResetFilters,
}: TransactionsToolbarProps): React.JSX.Element => {
	const { t } = useTranslation("billing");

	return (
		<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative w-full sm:w-80">
					<SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
					<Input
						value={searchValue}
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder={t("overview.toolbar.searchPlaceholder")}
						className="pl-9"
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="w-full sm:w-auto"
						>
							<FilterIcon className="size-4" />
							{t("overview.toolbar.filterByStatus")}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="min-w-44">
						<DropdownMenuRadioGroup
							value={statusValue}
							onValueChange={(value) =>
								onStatusChange(value as TransactionStatusFilter)
							}
						>
							<DropdownMenuRadioItem value="ALL">
								{t("overview.statusOptions.ALL")}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="SUCCESS">
								{t("overview.statusOptions.SUCCESS")}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="FAILED">
								{t("overview.statusOptions.FAILED")}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="PENDING">
								{t("overview.statusOptions.PENDING")}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="REFUNDED">
								{t("overview.statusOptions.REFUNDED")}
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="w-full sm:w-auto"
						>
							<FilterIcon className="size-4" />
							{t("overview.toolbar.filterByType")}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="min-w-44">
						<DropdownMenuRadioGroup
							value={typeValue}
							onValueChange={(value) =>
								onTypeChange(value as TransactionTypeFilter)
							}
						>
							<DropdownMenuRadioItem value="ALL">
								{t("overview.typeOptions.ALL")}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="TOPUP">
								{t("overview.typeOptions.TOPUP")}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="SUBSCRIPTION">
								{t("overview.typeOptions.SUBSCRIPTION")}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="SUBSCRIPTION_FEE">
								{t("overview.typeOptions.SUBSCRIPTION_FEE")}
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="OVERAGE_FEE">
								{t("overview.typeOptions.OVERAGE")}
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<DashboardTimeRangePicker
					date={dateRange}
					onDateRangeChange={onDateRangeChange}
				/>
				<Button type="button" variant="default" onClick={onResetFilters}>
					{t("overview.toolbar.resetFilters")}
				</Button>
			</div>
		</div>
	);
};

export default TransactionsToolbar;
