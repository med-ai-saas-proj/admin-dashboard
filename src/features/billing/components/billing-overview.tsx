import { CustomPagination } from "@/components/pagination/pagination";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { format, subDays } from "date-fns";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGetTransactions } from "../hooks/use-get-transactions";
import type {
	TransactionType,
	TransactionsParams,
} from "../services/get-transactions";
import TransactionsTable from "./overview/transactions-table";
import TransactionsToolbar, {
	type TransactionStatusFilter,
	type TransactionTypeFilter,
} from "./overview/transactions-toolbar";
import type { DateRange } from "react-day-picker";

type BillingOverviewFilterForm = {
	search: string;
	status: TransactionStatusFilter;
	type: TransactionTypeFilter;
	dateRange: DateRange | undefined;
};

const PAGE_SIZE = 20;

const BillingOverview = (): React.JSX.Element => {
	const { t: tCommon } = useTranslation("common");
	const { copy } = useCopyToClipboard();
	const [currentPage, setCurrentPage] = useState(1);

	const defaultDateRange = useMemo<DateRange>(
		() => ({
			from: subDays(new Date(), 30),
			to: new Date(),
		}),
		[]
	);

	const { control, setValue, reset } = useForm<BillingOverviewFilterForm>({
		defaultValues: {
			search: "",
			status: "ALL",
			type: "ALL",
			dateRange: defaultDateRange,
		},
	});

	const search = useWatch({ control, name: "search" }) ?? "";
	const status = useWatch({ control, name: "status" }) ?? "ALL";
	const type = useWatch({ control, name: "type" }) ?? "ALL";
	const dateRange = useWatch({ control, name: "dateRange" });

	const normalizedSearch = search.trim();

	const queryParams = useMemo<TransactionsParams>(() => {
		const params: TransactionsParams = {
			page: currentPage,
			per_page: PAGE_SIZE,
		};

		if (normalizedSearch) {
			params.transaction_id = normalizedSearch;
		}

		if (status !== "ALL") {
			params.status = status;
		}

		if (type !== "ALL") {
			params.type = type as TransactionType;
		}

		if (dateRange?.from) {
			params.start_date = format(dateRange.from, "yyyy-MM-dd");
			params.end_date = format(dateRange.to ?? dateRange.from, "yyyy-MM-dd");
		}

		return params;
	}, [currentPage, normalizedSearch, status, type, dateRange]);

	const {
		data: transactionData,
		isLoading,
		isError,
	} = useGetTransactions(queryParams);

	const rows = transactionData?.data ?? [];
	const total = transactionData?.total ?? 0;

	const handleCopyTransactionId = async (transactionId: string) => {
		const isCopied = await copy(transactionId);
		toast(isCopied ? tCommon("requestDone") : tCommon("error"));
	};

	const handleResetFilters = () => {
		setCurrentPage(1);
		reset({
			search: "",
			status: "ALL",
			type: "ALL",
			dateRange: defaultDateRange,
		});
	};

	return (
		<div className="space-y-4">
			{/* <h3 className="text-lg font-semibold">{t("overview.title")}</h3> */}

			<TransactionsToolbar
				searchValue={search}
				statusValue={status}
				typeValue={type}
				dateRange={dateRange}
				onSearchChange={(value) => {
					setCurrentPage(1);
					setValue("search", value);
				}}
				onStatusChange={(value) => {
					setCurrentPage(1);
					setValue("status", value);
				}}
				onTypeChange={(value) => {
					setCurrentPage(1);
					setValue("type", value);
				}}
				onDateRangeChange={(value) => {
					setCurrentPage(1);
					setValue("dateRange", value);
				}}
				onResetFilters={handleResetFilters}
			/>

			<TransactionsTable
				rows={rows}
				isLoading={isLoading}
				isError={isError}
				onCopyTransactionId={handleCopyTransactionId}
			/>

			{total > PAGE_SIZE && !isLoading && !isError ? (
				<CustomPagination
					currentPage={currentPage}
					limit={PAGE_SIZE}
					totalElements={total}
					onPageChange={setCurrentPage}
				/>
			) : null}
		</div>
	);
};

export default BillingOverview;
