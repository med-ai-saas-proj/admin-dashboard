import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/shadcn/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/table";
import { CustomPagination } from "@/components/pagination/pagination";
import { useGetAdminProjectUsers } from "../hooks/use-get-admin-project-users";
import { useAdminProjectDetailsStore } from "../store/admin-project-details";
import type { AdminProjectDetailsUsers as AdminProjectUser } from "../types/admin-project-details";

const AdminProjectDetailsUsersPage = (): React.JSX.Element => {
	const params = useParams<{ projectId: string }>();
	const storedProjectId = useAdminProjectDetailsStore.getState().projectId;
	const projectId = params.projectId || storedProjectId;

	const [inputQ, setInputQ] = useState<string>("");
	const [q, setQ] = useState<string | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [limit] = useState<number>(10);

	const offset = (currentPage - 1) * limit;

	const { data, isFetching, isLoading } = useGetAdminProjectUsers({
		projectId: projectId || "",
		limit,
		offset,
		q,
	});

	const { t } = useTranslation("admin-project");

	const handleSearch = () => {
		setCurrentPage(1);
		setQ(inputQ.trim() || undefined);
	};

	const users: AdminProjectUser[] = data?.results ?? [];
	const total = data?.total ?? 0;

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-bold">
				{t("users.title")} {projectId ? `(${projectId})` : ""}
			</h1>

			<div className="mb-4 flex items-center gap-2">
				<Input
					placeholder={t("users.search.placeholder")}
					value={inputQ}
					onChange={(e) => setInputQ(e.target.value)}
					className="max-w-sm"
				/>
				<Button onClick={handleSearch} variant="default" size="sm">
					{t("users.buttons.search")}
				</Button>
				{isFetching && (
					<div className="text-sm text-muted-foreground">
						{t("users.status.loading")}
					</div>
				)}
			</div>

			<div className="border rounded-lg overflow-hidden">
				{isLoading ? (
					<div className="flex justify-center items-center py-8">
						<Spinner className="h-6 w-6" />
					</div>
				) : users.length === 0 ? (
					<div className="flex justify-center items-center py-8 text-muted-foreground">
						{q
							? t("users.table.empty.withSearch")
							: t("users.table.empty.noData")}
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>#</TableHead>
								<TableHead>ID</TableHead>
								<TableHead>Username</TableHead>
								<TableHead>Email</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user, index) => (
								<TableRow key={user.id}>
									<TableCell>{offset + index + 1}</TableCell>
									<TableCell>{user.id}</TableCell>
									<TableCell>{user.username ?? "-"}</TableCell>
									<TableCell>{user.email ?? "-"}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{total > limit && (
				<div className="py-4 flex justify-center">
					<CustomPagination
						currentPage={currentPage}
						limit={limit}
						totalElements={total}
						onPageChange={(page) => setCurrentPage(page)}
					/>
				</div>
			)}
		</div>
	);
};

export default AdminProjectDetailsUsersPage;
