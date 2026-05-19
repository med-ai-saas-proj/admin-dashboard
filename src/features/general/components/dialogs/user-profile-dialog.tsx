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
import { useGetAdminUserProfile } from "../../hooks/use-get-admin-user-profile";

const UserProfileDialog = ({
	userId,
}: {
	userId: string;
}): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: profileData } = useGetAdminUserProfile({
		userId,
	});

	const profile = profileData?.data;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					aria-label="View details"
					className="hover:text-primary transition-colors"
					title="View details"
				>
					<Eye className="h-4 w-4" />
				</button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>{profile?.username}'s Profile</DialogTitle>
					<DialogDescription>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-x-4">
								<p>
									{profile?.first_name} {profile?.last_name}
								</p>
								<div className="border h-4" />
								<p>{profile?.email}</p>
							</div>
							<div className="flex items-center gap-x-2">
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
										profile?.enabled
											? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
											: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
									}`}
								>
									{profile?.enabled ? "Active" : "Inactive"}
								</span>
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
										profile?.email_verified
											? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
											: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
									}`}
								>
									{profile?.email_verified ? "Verified" : "Unverified"}
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-6 text-sm text-slate-700">
							{/* Section: Organization Info */}
							<section>
								<h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
									Organization Information
								</h3>
								<div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
									<ul className="space-y-1">
										{profile?.organizations.map((org) => (
											<li
												key={org.id}
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
							</section>

							{/* Section: Org Permissions */}
							<section>
								<h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
									Organization Permissions
								</h3>
								<div className="flex flex-wrap gap-2">
									{profile?.permissions.organization_permissions.map(
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
							</section>

							{/* Section: Project Permissions */}
							<section>
								<h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
									Project Permissions
								</h3>
								<div className="space-y-3">
									{profile?.permissions.project_permissions.map((projPerm) => (
										<div
											key={projPerm.id}
											className="p-3 border border-slate-200 rounded-lg bg-white shadow-sm"
										>
											<div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
												Project ID:{" "}
												<span className="text-slate-800 font-mono">
													{projPerm.id}
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
									))}
								</div>
							</section>
						</div>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="default">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UserProfileDialog;
