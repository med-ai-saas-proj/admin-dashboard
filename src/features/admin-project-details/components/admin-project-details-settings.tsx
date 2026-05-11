import { useParams } from "react-router-dom";

import { Button } from "@/components/shadcn/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import { useAdminProjectDetailsStore } from "../store/admin-project-details";
import { useGetAdminProjectSettings } from "../hooks/use-get-admin-project-settings";
import UpdateProjectSettingsDialog from "./dialogs/update-project-settings-dialog";

const AdminProjectDetailsSettings = (): React.JSX.Element => {
	const { projectId: projectIdParam } = useParams<{ projectId: string }>();
	const projectId =
		projectIdParam ?? useAdminProjectDetailsStore.getState().projectId ?? "";

	const { data: settingsData } = useGetAdminProjectSettings({ projectId });
	const settings = settingsData;

	return (
		<div className="space-y-12">
			<h1 className="text-2xl font-bold">
				Project Settings {projectId ? `(${projectId})` : ""}
			</h1>
			<div className="max-w-4xl mx-auto flex items-start justify-center">
				<Card className="w-full shadow-sm border-slate-200">
					<CardHeader className="pb-3">
						<CardTitle className="text-xl font-bold tracking-tight text-slate-900">
							Limits & Budgeting
						</CardTitle>
					</CardHeader>

					<CardContent className="grid gap-y-8">
						<div className="flex flex-col gap-2">
							<p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
								Rate Limit
							</p>
							<div className="flex items-baseline gap-2">
								<span className="text-2xl font-semibold text-slate-900">
									{settings?.rate_limit ?? "-"}
								</span>
								{settings?.rate_limit !== undefined && (
									<span className="text-xs text-slate-400">requests/sec</span>
								)}
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
								Spending Limit
							</p>
							<div className="flex items-baseline gap-2">
								<span className="text-2xl font-semibold text-slate-900">
									{settings?.spending_limit !== undefined
										? `$${settings.spending_limit}`
										: "-"}
								</span>
								{settings?.spending_limit !== undefined && (
									<span className="text-xs text-slate-400">per month</span>
								)}
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex justify-end">
						<UpdateProjectSettingsDialog
							projectId={projectId}
							currentSettings={settings}
							triggerElement={
								<Button variant="default" className="font-medium">
									Edit Settings
								</Button>
							}
						/>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default AdminProjectDetailsSettings;
