import { useState, useMemo } from "react";
import { useGetAdminUsers } from "@/features/general/hooks/use-get-admin-users";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { useTranslation } from "react-i18next";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/table";
import { CustomPagination } from "@/components/pagination/pagination";
import { Search } from "lucide-react";
import UserProfileDialog from "@/features/general/components/dialogs/user-profile-dialog";
import UserOrganizationsDialog from "@/features/general/components/dialogs/user-organizations";
import { Label } from "@/components/shadcn/label";
import { useGetAdminUserProfile } from "@/features/general/hooks/use-get-admin-user-profile";
import type { UserInfo } from "@/features/general/types/admin";
import { itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";

const UserActionDialogs = ({
	userId,
}: {
	userId: string;
}): React.JSX.Element => {
	const { data: profileData, isLoading: isProfileLoading } =
		useGetAdminUserProfile({
			userId,
		});

	const profile = profileData?.results;

	return (
		<div className="flex gap-x-6">
			<UserProfileDialog
				userId={userId}
				profile={profile}
				isProfileLoading={isProfileLoading}
			/>
			<UserOrganizationsDialog
				username={profile?.username || userId}
				organizations={profile?.organizations}
				isProfileLoading={isProfileLoading}
			/>
		</div>
	);
};

const LIMIT = 10;

const GeneralUsers = (): React.JSX.Element => {
	const { t } = useTranslation("admin-dashboard");
	const [currentPage, setCurrentPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [enabledFilter, setEnabledFilter] = useState<string | undefined>();
	const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<
		string | undefined
	>();

	const params = useMemo(
		() => ({
			limit: LIMIT,
			offset: (currentPage - 1) * LIMIT,
			q: searchQuery || undefined,
		}),
		[currentPage, searchQuery]
	);

	const { data: usersResponse } = useGetAdminUsers(params);

	const filteredUsers = useMemo(() => {
		// The response data should be an array based on the mock, but type says UserInfo
		const users = Array.isArray(usersResponse?.results)
			? usersResponse.results
			: [];
		let filtered = [...users] as UserInfo[];

		if (enabledFilter !== undefined) {
			const isEnabled = enabledFilter === "true";
			filtered = filtered.filter((u) => u.enabled === isEnabled);
		}

		if (emailVerifiedFilter !== undefined) {
			const isVerified = emailVerifiedFilter === "true";
			filtered = filtered.filter((u) => u.email_verified === isVerified);
		}

		return filtered;
	}, [usersResponse?.results, enabledFilter, emailVerifiedFilter]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	const handleSearchClick = () => {
		setSearchQuery(searchInput);
		setCurrentPage(1);
	};

	return (
		<motion.div
			className="px-4 py-8"
			variants={itemVariants}
			initial="hidden"
			animate="visible"
		>
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">{t("admin.users.title")}</h1>

				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex flex-1 gap-2 max-w-xl">
						<div className="flex-1">
							<Label
								htmlFor="search-input"
								className="mb-2 block text-sm font-medium"
							>
								{t("admin.users.search.label")}
							</Label>
							<Input
								id="search-input"
								placeholder={t("admin.users.search.placeholder")}
								value={searchInput}
								onChange={handleSearchInputChange}
								className="w-full"
							/>
						</div>
						<div className="flex items-end">
							<Button
								type="button"
								size="sm"
								className="gap-2"
								onClick={handleSearchClick}
							>
								<Search className="h-4 w-4" />
								{t("admin.users.button.search")}
							</Button>
						</div>
					</div>

					<div className="flex gap-x-12 sm:w-auto">
						<div className="flex-1 place-items-end sm:w-fit">
							<label
								htmlFor="status-filter"
								className="mb-2 block text-sm font-medium"
							>
								{t("admin.users.filters.status")}
							</label>
							<Select value={enabledFilter} onValueChange={setEnabledFilter}>
								<SelectTrigger id="status-filter" className="w-36">
									<SelectValue
										placeholder={t("admin.users.filters.status_placeholder")}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="true">
										{t("admin.users.filters.enabled")}
									</SelectItem>
									<SelectItem value="false">
										{t("admin.users.filters.disabled")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex-1 place-items-end sm:w-fit">
							<Label
								htmlFor="email-verified-filter"
								className="mb-2 block text-sm font-medium"
							>
								{t("admin.users.filters.email_verified")}
							</Label>
							<Select
								value={emailVerifiedFilter}
								onValueChange={setEmailVerifiedFilter}
							>
								<SelectTrigger id="email-verified-filter" className="w-36">
									<SelectValue
										placeholder={t(
											"admin.users.filters.email_verified_placeholder"
										)}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="true">
										{t("admin.users.filters.verified")}
									</SelectItem>
									<SelectItem value="false">
										{t("admin.users.filters.not_verified")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<div className="border space-y-4 rounded-lg">
					<Table className="border-none">
						<TableHeader>
							<TableRow>
								<TableHead>{t("admin.users.table.id")}</TableHead>
								<TableHead>{t("admin.users.table.username")}</TableHead>
								<TableHead>{t("admin.users.table.full_name")}</TableHead>
								<TableHead>{t("admin.users.table.email")}</TableHead>
								<TableHead>{t("admin.users.table.status")}</TableHead>
								<TableHead>{t("admin.users.table.email_verified")}</TableHead>
								<TableHead className="w-20">
									{t("admin.users.table.actions")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user: UserInfo) => (
									<TableRow key={user.user_id}>
										<TableCell className="font-mono text-xs">
											{user.user_id}
										</TableCell>
										<TableCell>{user.username}</TableCell>
										<TableCell>
											{user.first_name && user.last_name
												? `${user.first_name} ${user.last_name}`
												: "—"}
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											<span
												className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
													user.enabled
														? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
														: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
												}`}
											>
												{user.enabled
													? t("admin.users.table.active")
													: t("admin.users.table.inactive")}
											</span>
										</TableCell>
										<TableCell>
											<span
												className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
													user.email_verified
														? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
														: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
												}`}
											>
												{user.email_verified
													? t("admin.users.table.yes")
													: t("admin.users.table.no")}
											</span>
										</TableCell>
										<TableCell>
											<UserActionDialogs userId={user.user_id} />
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={7} className="py-8 text-center">
										{t("admin.users.table.no_users")}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				{filteredUsers.length > 0 && (
					<div className="flex justify-center px-4 py-4">
						<CustomPagination
							currentPage={currentPage}
							limit={LIMIT}
							totalElements={usersResponse?.total || 0}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default GeneralUsers;
