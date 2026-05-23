import { useGetAdminProjectsPermissions } from "../hooks/use-get-admin-projects-permissions";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import { useTranslation } from "react-i18next";

const AdminProjectsPermissions = (): React.JSX.Element => {
	const { t } = useTranslation("admin-project");
	const { data: permissionsData } = useGetAdminProjectsPermissions();
	const permissions = permissionsData?.results?.permissions || [];

	return (
		<Card className="w-full max-w-lg border border-slate-200 mx-auto shadow hover:shadow-lg transition-all duration-1000">
			<CardHeader className="pb-4 border-b border-slate-10">
				<div className="flex items-center justify-between gap-4">
					<div>
						<CardTitle className="text-xl font-bold text-slate-950">
							{t("permissions.card.title")}
						</CardTitle>
						<p className="text-sm text-slate-500 mt-1">
							{t("permissions.card.description")}
						</p>
					</div>
					{/* Optional: Visual Indicator */}
					<span className="relative flex h-3 w-3">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
					</span>
				</div>
			</CardHeader>

			<CardContent>
				<div className="flex flex-wrap gap-2.5">
					{/* Example Permissions - In real code, map over your data */}
					{permissions.map((perm) => (
						<span
							key={perm}
							className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 cursor-default transition-all"
						>
							{/* Subtle Icon (Optional but recommended) */}
							<span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
							{perm}
						</span>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminProjectsPermissions;
