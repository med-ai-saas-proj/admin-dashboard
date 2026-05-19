import { useMemo, useState } from "react";

import { Button } from "@/components/shadcn/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/table";
import type { CreditTransaction } from "../billing.type";
import { useGetCreditTransactions } from "../hooks/use-get-credit-transactions";
import AddCreditDialog from "./dialogs/add-credits-dialog";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAdminOrganizationDetailsStore } from "@/features/admin-organization-details/store/admin-organization-details";

const BillingCredit = (): React.JSX.Element => {
	const { t } = useTranslation("billing");
	const { orgId } = useParams<{
		orgId: string;
	}>();

	const [limit, setLimit] = useState(10);
	const storedOrganizationId = useAdminOrganizationDetailsStore(
		(state) => state.organizationId
	);

	const params = useMemo(
		() => ({
			organizationId: orgId || storedOrganizationId || "",
			offset: 0,
			limit,
		}),
		[orgId, storedOrganizationId, limit]
	);
	const { data: creditTransactions } = useGetCreditTransactions(params);

	const rows: CreditTransaction[] = creditTransactions?.data ?? [];
	const total = creditTransactions?.total ?? 0;
	const hasMore = rows.length < total;

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<AddCreditDialog
					triggerElement={
						<Button>{t("dialogs.addCredit.actions.trigger")}</Button>
					}
				/>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t("creditTransactions.columns.amount")}</TableHead>
						<TableHead>{t("creditTransactions.columns.description")}</TableHead>
						<TableHead>{t("creditTransactions.columns.createdAt")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={3}
								className="py-6 text-center text-muted-foreground"
							>
								{t("creditTransactions.empty")}
							</TableCell>
						</TableRow>
					) : (
						rows.map((transaction, index) => (
							<TableRow key={`${transaction.created_at}-${index}`}>
								<TableCell className="font-medium">
									{transaction.amount}
								</TableCell>
								<TableCell>{transaction.description || "-"}</TableCell>
								<TableCell>
									{new Date(transaction.created_at).toLocaleString()}
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
						{t("creditTransactions.actions.loadMore")}
					</Button>
				) : (
					<p className="text-sm text-muted-foreground">
						{t("creditTransactions.endOfTable")}
					</p>
				)}
			</div>
		</div>
	);
};

export default BillingCredit;
