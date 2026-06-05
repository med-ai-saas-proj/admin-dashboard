import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetAdminUserProfile } from "../../hooks/use-get-admin-user-profile";

const UserProfileDialog = ({
	userId,
}: {
	userId: string;
}): React.JSX.Element => {
	const { t } = useTranslation("admin-dashboard");

	const [isOpen, setIsOpen] = useState(false);
	const { data, isLoading: isProfileLoading } = useGetAdminUserProfile({
		params: { userId },
		enabled: isOpen,
	});
	const userProfile = data?.results;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					aria-label={t("admin.users.profile.trigger.view_details")}
					className="hover:text-primary transition-colors"
					title={t("admin.users.profile.trigger.view_details")}
				>
					<Eye className="h-4 w-4" />
				</button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>
						{userProfile?.username
							? t("admin.users.profile.dialog.title_with_username", {
									username: userProfile.username,
								})
							: t("admin.users.profile.dialog.title_with_user_id", {
									userId,
								})}
					</DialogTitle>
					<DialogDescription>
						{isProfileLoading ? (
							<p className="text-sm text-muted-foreground">
								{t("admin.users.profile.loading")}
							</p>
						) : (
							<>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-x-4">
										<p>
											{userProfile?.first_name} {userProfile?.last_name}
										</p>
										<div className="border h-4" />
										<p>{userProfile?.email}</p>
									</div>
									<div className="flex items-center gap-x-2">
										<span
											className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
												userProfile?.enabled
													? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
													: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
											}`}
										>
											{userProfile?.enabled
												? t("admin.users.profile.status.active")
												: t("admin.users.profile.status.inactive")}
										</span>
										<span
											className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
												userProfile?.email_verified
													? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
													: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
											}`}
										>
											{userProfile?.email_verified
												? t("admin.users.profile.status.verified")
												: t("admin.users.profile.status.unverified")}
										</span>
									</div>
								</div>
								<div className="flex flex-col gap-6 text-sm text-slate-700">
									{/* Section: Organization Info */}
									<section>
										<h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
											{t(
												"admin.users.profile.sections.organization_information"
											)}
										</h3>
										{userProfile?.organizations &&
										userProfile.organizations.length > 0 ? (
											<div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
												<ul className="space-y-1">
													{userProfile.organizations.map((org) => (
														<li
															key={org.org_id}
															className="flex justify-between items-center"
														>
															<span className="font-medium text-slate-800">
																{org.name}
															</span>
															<span className="text-xs font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
																{org.alias}
															</span>
														</li>
													))}
												</ul>
											</div>
										) : (
											<p className="text-sm text-muted-foreground">
												{t(
													"admin.users.profile.empty.organization_information"
												)}
											</p>
										)}
									</section>

									{/* Section: Org Permissions */}
									<section>
										<h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
											{t(
												"admin.users.profile.sections.organization_permissions"
											)}
										</h3>
										{userProfile?.permissions.organization_permissions &&
										userProfile?.permissions.organization_permissions.length >
											0 ? (
											<div className="flex flex-wrap gap-2">
												{userProfile.permissions.organization_permissions.map(
													(perm, index) => (
														<span
															key={index}
															className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
														>
															{perm}
														</span>
													)
												)}
											</div>
										) : (
											<p className="text-sm text-muted-foreground">
												{t(
													"admin.users.profile.empty.organization_permissions"
												)}
											</p>
										)}
									</section>

									{/* Section: Project Permissions */}
									<section>
										<h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
											{t("admin.users.profile.sections.project_permissions")}
										</h3>
										{userProfile?.permissions.project_permissions &&
										userProfile?.permissions.project_permissions.length > 0 ? (
											<div className="space-y-3">
												{userProfile.permissions.project_permissions.map(
													(projPerm) => (
														<div
															key={projPerm.project_uuid}
															className="p-3 border border-slate-200 rounded-lg bg-white shadow-sm"
														>
															<div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
																{t("admin.users.profile.labels.project_id")}{" "}
																<span className="text-slate-800 font-mono">
																	{projPerm.project_uuid}
																</span>
															</div>
															<div className="flex flex-wrap gap-1.5">
																{projPerm.permissions.map((perm, index) => (
																	<span
																		key={index}
																		className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 text-[11px]"
																	>
																		{perm}
																	</span>
																))}
															</div>
														</div>
													)
												)}
											</div>
										) : (
											<p className="text-sm text-muted-foreground">
												{t("admin.users.profile.empty.project_permissions")}
											</p>
										)}
									</section>
								</div>
							</>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="default">
							{t("admin.users.profile.buttons.cancel")}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UserProfileDialog;
