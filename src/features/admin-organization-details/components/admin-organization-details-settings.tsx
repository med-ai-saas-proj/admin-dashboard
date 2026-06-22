import { useParams } from "react-router-dom";
import { useGetAdminOrganizationSettings } from "../hooks/use-get-admin-organization-settings";
import { useAdminOrganizationDetailsStore } from "../store/admin-organization-details";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useGetAdminOrganizationDetails } from "@/features/admin-organizations/hooks/use-get-admin-organizations-details";
import UpdateOrganizationSettingsDialog from "./dialogs/update-organization-settings-dialog";
import { useTranslation } from "react-i18next";
import { containerVariants, itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";
import { Button } from "@/components/shadcn/button";
import { Pencil } from "lucide-react";

const MotionCard = motion(Card);

const AdminOrganizationDetailsSettings = (): React.JSX.Element => {
	const { orgId } = useParams<{ orgId: string }>();
	const organizationId =
		orgId ?? useAdminOrganizationDetailsStore.getState().organizationId ?? "";

	const { data: settingsData, isLoading } = useGetAdminOrganizationSettings({
		organizationId,
	});
	const { data: organizationInfo } = useGetAdminOrganizationDetails(
		{ organization_id: organizationId },
		{ enabled: !!organizationId }
	);
	const { t } = useTranslation("admin-organization");

	const settings = settingsData?.results;

	return (
		<motion.div variants={containerVariants} initial="hidden" animate="visible">
			{organizationInfo && (
				<h1 className="text-2xl font-bold mb-6">
					{t("settings.title")}{" "}
					{organizationInfo.results.name ||
						t("details.labels.organizationName")}{" "}
					({organizationId})
				</h1>
			)}

			<MotionCard variants={itemVariants} className="max-w-4xl mt-20 mx-auto">
				<CardHeader className="flex flex-row items-start justify-between gap-4">
					<div className="space-y-1">
						<CardTitle className="text-2xl">
							{t("settings.card.title")}
						</CardTitle>
						<CardDescription className="text-base">
							{t("settings.card.description")}
						</CardDescription>
					</div>

					{!isLoading && (
						<UpdateOrganizationSettingsDialog
							organizationId={organizationId}
							currentSettings={settings}
							triggerElement={
								<Button size="sm" variant="outline" className="gap-2">
									<Pencil className="h-4 w-4" />
									{t("settings.buttons.editSettings")}
								</Button>
							}
						/>
					)}
				</CardHeader>

				<CardContent>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="rounded-md bg-muted p-4 flex flex-col gap-1">
							<p className="text-sm text-muted-foreground mb-2">
								{t("settings.labels.rateLimit")}
							</p>
							{isLoading ? (
								<Skeleton className="h-5 w-24" />
							) : (
								<p className="text-base font-medium">
									{settings?.rate_limit ?? "—"}{" "}
									<span className="text-base text-black font-normal">
										{t("settings.units.rateLimit")}
									</span>
								</p>
							)}
						</div>

						<div className="rounded-md bg-muted p-4 flex flex-col gap-1">
							<p className="text-sm text-muted-foreground mb-2">
								{t("settings.labels.spendingLimit")}
							</p>
							{isLoading ? (
								<Skeleton className="h-5 w-24" />
							) : (
								<p className="text-base font-medium">
									{settings?.spending_limit != null
										? new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: "USD",
											}).format(settings.spending_limit)
										: "—"}
								</p>
							)}
						</div>
					</div>
				</CardContent>
			</MotionCard>
		</motion.div>
	);
};

export default AdminOrganizationDetailsSettings;
