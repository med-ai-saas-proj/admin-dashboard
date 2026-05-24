import { useGetAdminApiKeyPermissions } from "../hooks/use-get-admin-api-key-permissions";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import { useTranslation } from "react-i18next";

const AdminApiKeysPermissions = (): React.JSX.Element => {
	const { t } = useTranslation("admin-api-key");
	const { data: permissionsData } = useGetAdminApiKeyPermissions();
	const permissions = Array.isArray(permissionsData?.results)
		? permissionsData.results
		: [];

	return (
		<Card className="w-full max-w-lg border border-slate-200 mx-auto shadow hover:shadow-lg transition-all duration-300">
			<CardHeader className="pb-4 border-b border-slate-100">
				<div className="flex items-center justify-between gap-4">
					<div>
						<CardTitle className="text-xl font-bold text-slate-950">
							{t("permissions.card.title")}
						</CardTitle>
						<p className="text-sm text-slate-500 mt-1">
							{t("permissions.card.description")}
						</p>
					</div>
					<span className="relative flex h-3 w-3">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
					</span>
				</div>
			</CardHeader>

			<CardContent>
				<div className="space-y-3 max-h-136 overflow-y-auto">
					{permissions.map((p) => (
						<div
							key={p.id}
							className="p-3 border border-slate-200 rounded-lg bg-white shadow-sm"
						>
							<div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
								{t("permissions.item.idLabel")}:{" "}
								<span className="text-slate-800 font-mono">{p.id}</span>
							</div>
							<div className="font-medium text-slate-900">{p.name}</div>
							<div className="text-sm text-slate-600 mt-1">{p.description}</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminApiKeysPermissions;
