import { useParams } from "react-router-dom";
import { useGetAdminOrganizationSettings } from "../hooks/use-get-admin-organization-settings";
import { useAdminOrganizationDetailsStore } from "../store/admin-organization-details";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/shadcn/card";
import { useGetAdminOrganizationDetails } from "@/features/admin-organizations/hooks/use-get-admin-organizations-details";
import { Button } from "@/components/shadcn/button";
import UpdateOrganizationSettingsDialog from "./dialogs/update-organization-settings-dialog";
import { useTranslation } from "react-i18next";

const AdminOrganizationDetailsSettings = (): React.JSX.Element => {
	const { orgId } = useParams<{ orgId: string }>();
	const organizationId =
		orgId ?? useAdminOrganizationDetailsStore.getState().organizationId ?? "";

	const { data: settingsData } = useGetAdminOrganizationSettings({
		organizationId,
	});
	const { data: organizationInfo } = useGetAdminOrganizationDetails(
		{
			organization_id: organizationId,
		},
		{
			enabled: !!organizationId,
		}
	);
	const { t } = useTranslation("admin-organization");

	const settings = settingsData?.data;

	return (
		<div className="space-y-12">
			{organizationInfo && (
				<h1 className="text-2xl font-bold">
					{t("settings.title")}{" "}
					{organizationInfo.data.name || t("details.labels.organizationName")} (
					{organizationId})
				</h1>
			)}
			<div className="max-w-4xl mx-auto flex items-start justify-center gap-x-4">
				<Card className="w-full shadow-sm border-slate-200">
					<CardHeader className="pb-3">
						<CardTitle className="text-xl font-bold tracking-tight text-slate-900">
							{t("settings.card.title")}
						</CardTitle>
					</CardHeader>

					<CardContent className="grid gap-y-8">
						{/* Rate Limit Section */}
						<div className="flex flex-col gap-2">
							<p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
								{t("settings.labels.rateLimit")}
							</p>
							<div className="flex items-baseline gap-2">
								<span className="text-2xl font-semibold text-slate-900">
									{settings?.rate_limit ?? "-"}
								</span>
								{settings?.rate_limit && (
									<span className="text-xs text-slate-400">
										{t("settings.units.rateLimit")}
									</span>
								)}
							</div>
						</div>

						{/* Spending Limit Section */}
						<div className="flex flex-col gap-2">
							<p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
								{t("settings.labels.spendingLimit")}
							</p>
							<div className="flex items-baseline gap-2">
								<span className="text-2xl font-semibold text-slate-900">
									{settings?.spending_limit
										? `$${settings.spending_limit}`
										: "-"}
								</span>
								{settings?.spending_limit && (
									<span className="text-xs text-slate-400">
										{t("settings.units.spendingLimit")}
									</span>
								)}
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex justify-end">
						<UpdateOrganizationSettingsDialog
							organizationId={organizationId}
							currentSettings={settings}
							triggerElement={
								<Button variant="default" className="font-medium">
									{t("settings.buttons.editSettings")}
								</Button>
							}
						/>
					</CardFooter>
				</Card>
				{/* <Card className="w-full shadow-sm border-slate-200">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
							Additional Metadata
						</CardTitle>
					</CardHeader>
					<CardContent>
						{settings?.extra && Object.keys(settings.extra).length > 0 ? (
							<dl className="divide-y divide-slate-100">
								{Object.entries(settings.extra).map(([key, value]) => (
									<div
										key={key}
										className="flex flex-col py-3 sm:flex-row sm:justify-between sm:items-center"
									>
										<dt className="text-sm font-medium text-slate-600 capitalize">
											{key.replace(/_/g, " ")}
										</dt>
										<dd className="mt-1 text-sm text-slate-900 sm:mt-0 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100">
											{String(value)}
										</dd>
									</div>
								))}
							</dl>
						) : (
							<div className="py-6 text-center text-sm text-slate-400 italic">
								No additional settings available.
							</div>
						)}
					</CardContent>
				</Card> */}
			</div>
		</div>
	);
};

export default AdminOrganizationDetailsSettings;
