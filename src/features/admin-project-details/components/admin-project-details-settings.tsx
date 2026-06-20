import { useParams } from "react-router-dom";

import { Button } from "@/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useAdminProjectDetailsStore } from "../store/admin-project-details";
import { useGetAdminProjectSettings } from "../hooks/use-get-admin-project-settings";
import UpdateProjectSettingsDialog from "./dialogs/update-project-settings-dialog";
import { useTranslation } from "react-i18next";
import { containerVariants, itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

const MotionCard = motion(Card);

const AdminProjectDetailsSettings = (): React.JSX.Element => {
	const { projectId: projectIdParam } = useParams<{ projectId: string }>();
	const projectId =
		projectIdParam ?? useAdminProjectDetailsStore.getState().projectId ?? "";

	const { data: settingsData, isLoading } = useGetAdminProjectSettings({
		projectId,
	});
	const { t } = useTranslation("admin-project");

	const settings = settingsData?.results;

	return (
		<motion.div variants={containerVariants} initial="hidden" animate="visible">
			{projectId && (
				<h1 className="text-2xl font-bold mb-6">
					{t("settings.title")} ({projectId})
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
						<UpdateProjectSettingsDialog
							projectId={projectId}
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

export default AdminProjectDetailsSettings;
