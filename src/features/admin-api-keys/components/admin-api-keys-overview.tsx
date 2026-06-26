import { useMemo, useState } from "react";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { Spinner } from "@/components/shadcn/spinner";
import { CustomPagination } from "@/components/pagination/pagination";
import { useGetAdminApiKeysProject } from "../hooks/use-get-admin-api-key-project";
import { CreateAdminApiKeyDialog } from "./dialogs/create-admin-api-key-dialog";
import ViewAdminApiKeyDialog from "./dialogs/view-admin-api-key-dialog";
import UpdateAdminApiKeyDialog from "./dialogs/update-admin-api-key-dialog";
import DeleteAdminApiKeyDialog from "./dialogs/delete-admin-api-key-dialog";
import { useParams } from "react-router-dom";
import type { AdminApiKey } from "../types/admin-api-keys";
import { itemVariants } from "@/lib/animations";
import { motion } from "framer-motion";

const AdminApiKeysOverview = (): React.JSX.Element => {
	const params = useParams<{ projectId: string }>();
	const projectId = params.projectId || "";
	const { t } = useTranslation("admin-api-key");

	const { data, isLoading, isFetching } = useGetAdminApiKeysProject(projectId);

	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [disabledFilter, setDisabledFilter] = useState<
		"all" | "enabled" | "disabled"
	>("all");

	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedKey, setSelectedKey] = useState<AdminApiKey | null>(null);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const limit = 10;

	const apiKeys = Array.isArray(data?.results) ? data.results : [];

	const filtered = useMemo(() => {
		return apiKeys.filter((k: AdminApiKey) => {
			const matchesSearch =
				!searchTerm ||
				k.api_key_uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
				k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(k.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
					false) ||
				k.project_uuid.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesDisabled =
				disabledFilter === "all" ||
				(disabledFilter === "disabled" && k.disabled) ||
				(disabledFilter === "enabled" && !k.disabled);

			return matchesSearch && matchesDisabled;
		});
	}, [apiKeys, searchTerm, disabledFilter]);

	const paginated = useMemo(() => {
		const start = (currentPage - 1) * limit;
		return filtered.slice(start, start + limit);
	}, [filtered, currentPage]);

	const handleSearch = () => {
		setSearchTerm(searchInput.trim());
		setCurrentPage(1);
	};

	const handleView = (k: AdminApiKey) => {
		setSelectedKey(k);
		setViewDialogOpen(true);
	};

	const handleOpenUpdate = (k: AdminApiKey) => {
		setSelectedKey(k);
		setUpdateDialogOpen(true);
	};

	const handleOpenDelete = (k: AdminApiKey) => {
		setSelectedKey(k);
		setDeleteDialogOpen(true);
	};

	return (
		<motion.div variants={itemVariants} initial="hidden" animate="visible">
			<div className="space-y-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSearch();
						}}
						className="flex flex-1 flex-col gap-3 sm:flex-row"
					>
						<div className="flex flex-1 items-center gap-2 max-w-xl">
							<Input
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								placeholder={t("overview.search.placeholder")}
								className="min-w-0"
							/>
							<Button type="submit" variant="default">
								<Search className="size-4" />
								{t("overview.buttons.search")}
							</Button>
						</div>

						<Select
							value={disabledFilter}
							onValueChange={(value) =>
								setDisabledFilter(value as typeof disabledFilter)
							}
						>
							<SelectTrigger className="w-full sm:w-[220px]">
								<SelectValue placeholder={t("overview.filter.label")} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									{t("overview.filter.options.all")}
								</SelectItem>
								<SelectItem value="enabled">
									{t("overview.filter.options.enabled")}
								</SelectItem>
								<SelectItem value="disabled">
									{t("overview.filter.options.disabled")}
								</SelectItem>
							</SelectContent>
						</Select>
					</form>

					<CreateAdminApiKeyDialog projectId={projectId} />
				</div>

				<div className="rounded-lg border bg-background shadow-sm overflow-hidden">
					<div className="max-h-[60vh] overflow-auto">
						{isLoading ? (
							<div className="flex items-center justify-center py-16">
								<Spinner className="size-6" />
							</div>
						) : filtered.length === 0 ? (
							<div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
								{isFetching
									? t("overview.table.empty.loading")
									: t("overview.table.empty.noData")}
							</div>
						) : (
							<Table>
								<TableHeader className="sticky top-0 z-10 bg-background">
									<TableRow>
										<TableHead>{t("overview.table.headers.uuid")}</TableHead>
										<TableHead>{t("overview.table.headers.name")}</TableHead>
										<TableHead>{t("overview.table.headers.hint")}</TableHead>
										<TableHead>
											{t("overview.table.headers.description")}
										</TableHead>
										<TableHead>{t("overview.table.headers.created")}</TableHead>
										<TableHead>
											{t("overview.table.headers.disabled")}
										</TableHead>
										<TableHead className="text-right">
											{t("overview.table.headers.actions")}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{paginated.map((k: AdminApiKey) => (
										<TableRow key={k.api_key_uuid}>
											<TableCell>{k.api_key_uuid}</TableCell>
											<TableCell>{k.name}</TableCell>
											<TableCell>{k.hint ?? "-"}</TableCell>
											<TableCell>{k.description ?? "-"}</TableCell>
											<TableCell>
												{new Date(k.created_at).toLocaleString()}
											</TableCell>
											<TableCell>
												{k.disabled
													? t("overview.status.disabled")
													: t("overview.status.enabled")}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleView(k)}
															>
																<Eye className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															{t("overview.actions.view")}
														</TooltipContent>
													</Tooltip>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleOpenUpdate(k)}
															>
																<Pencil className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															{t("overview.actions.edit")}
														</TooltipContent>
													</Tooltip>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleOpenDelete(k)}
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															{t("overview.actions.delete")}
														</TooltipContent>
													</Tooltip>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</div>
				</div>

				<div className="flex items-center justify-end">
					<CustomPagination
						currentPage={currentPage}
						limit={limit}
						totalElements={filtered.length}
						onPageChange={(p) => setCurrentPage(p)}
					/>
				</div>

				<ViewAdminApiKeyDialog
					open={viewDialogOpen}
					onOpenChange={setViewDialogOpen}
					apiKey={selectedKey}
				/>
				<UpdateAdminApiKeyDialog
					open={updateDialogOpen}
					onOpenChange={setUpdateDialogOpen}
					apiKey={selectedKey}
				/>
				<DeleteAdminApiKeyDialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					apiKey={selectedKey}
				/>
			</div>
		</motion.div>
	);
};

export default AdminApiKeysOverview;
