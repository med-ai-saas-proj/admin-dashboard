import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Spinner } from "@/components/shadcn/spinner";
import { CustomPagination } from "@/components/pagination/pagination";
import { Eye, Pencil, Trash2, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetAdminOrganizations } from "../hooks/use-get-admin-organizations";
import { useCallback, useState } from "react";
import type { AdminOrganization } from "../types/admin-organizations";
import {
	CancelDeleteOrganizationDialog,
	CreateAdminOrganizationDialog,
	UpdateAdminOrganizationDialog,
	DeleteAdminOrganizationDialog,
	ViewDetailsAdminOrganizationDialog,
} from "./dialogs";
import { itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";
import { formatIsoDateWithGmt } from "@/lib/utils";

const AdminOrganizationsOverview = (): React.JSX.Element => {
	const { t } = useTranslation("admin-organization");

	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [limit] = useState(10);
	const [selectedOrganization, setSelectedOrganization] =
		useState<AdminOrganization | null>(null);

	// Dialog states
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [cancelDeleteDialogOpen, setCancelDeleteDialogOpen] = useState(false);

	const offset = (currentPage - 1) * limit;
	const { data, isLoading } = useGetAdminOrganizations({
		limit,
		offset,
		q: searchQuery || undefined,
	});
	const organizations = data?.results || [];
	const totalElements = data?.total ?? 0;

	const handleSearch = () => {
		setCurrentPage(1);
		setSearchQuery(searchInput);
	};

	// Action handlers
	const handleViewDetails = useCallback((org: AdminOrganization) => {
		setSelectedOrganization(org);
		setViewDetailsDialogOpen(true);
	}, []);

	const handleUpdate = useCallback((org: AdminOrganization) => {
		setSelectedOrganization(org);
		setUpdateDialogOpen(true);
	}, []);

	const handleDelete = useCallback((org: AdminOrganization) => {
		setSelectedOrganization(org);
		setDeleteDialogOpen(true);
	}, []);

	const handleRestore = useCallback((org: AdminOrganization) => {
		setSelectedOrganization(org);
		setCancelDeleteDialogOpen(true);
	}, []);

	return (
		<motion.div
			className="space-y-4"
			variants={itemVariants}
			initial="hidden"
			animate="visible"
		>
			{/* Header with Search and Create Button */}
			<div className="flex gap-3 items-center justify-between">
				<div className="flex-1 flex items-center gap-x-2 max-w-xl">
					<Input
						id="search"
						placeholder={t("overview.search.placeholder")}
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<Button
						onClick={handleSearch}
						className="whitespace-nowrap"
						variant="default"
					>
						{t("overview.buttons.search")}
					</Button>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => setCreateDialogOpen(true)}
						className="whitespace-nowrap"
					>
						{t("overview.buttons.createOrganization")}
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className="border rounded-lg overflow-hidden">
				{isLoading ? (
					<div className="flex justify-center items-center py-8">
						<Spinner className="h-6 w-6" />
					</div>
				) : organizations.length === 0 ? (
					<div className="flex justify-center items-center py-8 text-muted-foreground">
						{searchQuery
							? t("overview.table.empty.withSearch")
							: t("overview.table.empty.noData")}
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									{t("overview.table.headers.organizationId")}
								</TableHead>
								<TableHead>
									{t("overview.table.headers.organizationName")}
								</TableHead>
								<TableHead>{t("overview.table.headers.ownerId")}</TableHead>
								<TableHead>{t("overview.table.headers.requestedAt")}</TableHead>
								<TableHead>{t("overview.table.headers.deletedAt")}</TableHead>
								<TableHead className="text-right">
									{t("overview.table.headers.actions")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{organizations.map((org) => (
								<TableRow key={org.org_id}>
									<TableCell className="font-mono text-sm">
										{org.org_id}
									</TableCell>
									<TableCell>{org.name}</TableCell>
									<TableCell>
										{org.owner_id || t("common.notAvailable")}
									</TableCell>
									<TableCell>
										{org.requested_at
											? formatIsoDateWithGmt(org.requested_at, {
													showTime: true,
													showGmt: true,
												})
											: t("common.notAvailable")}
									</TableCell>
									<TableCell>
										{org.delete_at
											? formatIsoDateWithGmt(org.delete_at, {
													showTime: true,
													showGmt: true,
												})
											: t("common.notAvailable")}
									</TableCell>
									<TableCell className="text-right">
										<TooltipProvider>
											<div className="flex gap-2 justify-end">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleViewDetails(org)}
														>
															<Eye className="h-4 w-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														{t("overview.actions.viewDetails")}
													</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleUpdate(org)}
														>
															<Pencil className="h-4 w-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														{t("overview.actions.update")}
													</TooltipContent>
												</Tooltip>
												{!org.requested_at ? (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleDelete(org)}
															>
																<Trash2 className="h-4 w-4 text-destructive" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															{t("overview.actions.delete")}
														</TooltipContent>
													</Tooltip>
												) : (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleRestore(org)}
															>
																<Undo2 className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>{t("overview.actions.restore")}</p>
														</TooltipContent>
													</Tooltip>
												)}
											</div>
										</TooltipProvider>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{/* Pagination */}
			{totalElements > limit && (
				<div className="py-4 flex justify-center">
					<CustomPagination
						currentPage={currentPage}
						limit={limit}
						totalElements={totalElements}
						onPageChange={(p) => setCurrentPage(p)}
					/>
				</div>
			)}

			{/* Dialogs */}
			<CreateAdminOrganizationDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
			/>

			<ViewDetailsAdminOrganizationDialog
				open={viewDetailsDialogOpen}
				onOpenChange={setViewDetailsDialogOpen}
				organization={selectedOrganization}
			/>

			<UpdateAdminOrganizationDialog
				open={updateDialogOpen}
				onOpenChange={setUpdateDialogOpen}
				organization={selectedOrganization}
			/>

			<DeleteAdminOrganizationDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				organization={selectedOrganization}
			/>

			<CancelDeleteOrganizationDialog
				open={cancelDeleteDialogOpen}
				onOpenChange={setCancelDeleteDialogOpen}
				organization={selectedOrganization}
			/>
		</motion.div>
	);
};

export default AdminOrganizationsOverview;
