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
import { formatIsoDateWithGmt } from "@/lib/utils";
import { itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";

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
			organizationId: storedOrganizationId || orgId || "",
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
		<motion.div
			className="space-y-4"
			variants={itemVariants}
			initial="hidden"
			animate="visible"
		>
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
									{Number(transaction.amount).toFixed(2)}
								</TableCell>
								<TableCell>{transaction.description || "-"}</TableCell>
								<TableCell>
									{formatIsoDateWithGmt(transaction.created_at, {
										monthFormat: "letters",
										showTime: true,
										showGmt: true,
									})}
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
		</motion.div>
	);
};

export default BillingCredit;
