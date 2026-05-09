import { useState } from "react";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Spinner } from "@/components/shadcn/spinner";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/shadcn/table";
import { CustomPagination } from "@/components/pagination/pagination";

import { adminOrganizationDetailsStore } from "../store/admin-organization-details";
import { useGetAdminOrganizationUsers } from "../hooks/use-get-admin-organization-users";
import type { AdminUserOrganization } from "@/features/admin-organization-details/types/admin-organization-details";
import { useParams } from "react-router-dom";
import { useGetAdminOrganizationDetails } from "@/features/admin-organizations/hooks/use-get-admin-organizations-details";

const AdminOrganizationDetailsUsers = (): React.JSX.Element => {
	const { orgId } = useParams<{ orgId: string }>();
	const organizationId =
		orgId ?? adminOrganizationDetailsStore.getState().organizationId ?? "";

	const [inputQ, setInputQ] = useState<string>("");
	const [q, setQ] = useState<string | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [limit] = useState<number>(10);

	const offset = (currentPage - 1) * limit;

	const { data: organizationInfo } = useGetAdminOrganizationDetails(
		{
			organization_id: organizationId,
		},
		{
			enabled: !!organizationId,
		}
	);
	const { data, isFetching, refetch, isLoading } = useGetAdminOrganizationUsers(
		{
			orgId: organizationId || "",
			limit,
			offset,
			q,
		}
	);

	const handleSearch = async () => {
		setCurrentPage(1);
		setQ(inputQ || undefined);
		await refetch();
	};

	const users: AdminUserOrganization[] = data?.data ?? [];
	const total = data?.total ?? 0;

	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-bold">
				Organization Users of{" "}
				{organizationInfo?.data.name || "Unknown Organization"}
			</h1>
			<div className="mb-4 flex gap-2 items-center">
				<Input
					placeholder="Search users"
					value={inputQ}
					onChange={(e) => setInputQ(e.target.value)}
					className="max-w-sm"
				/>
				<Button onClick={handleSearch} variant="default" size="sm">
					Search
				</Button>
				{isFetching && (
					<div className="text-sm text-muted-foreground">Loading...</div>
				)}
			</div>

			<div className="border rounded-lg overflow-hidden">
				{isLoading ? (
					<div className="flex justify-center items-center py-8">
						<Spinner className="h-6 w-6" />
					</div>
				) : users.length === 0 ? (
					<div className="flex justify-center items-center py-8 text-muted-foreground">
						{q ? "No users found matching your search" : "No users"}
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
							{users.map((u: AdminUserOrganization, index: number) => (
								<TableRow key={u.id}>
									<TableCell>{offset + index + 1}</TableCell>
									<TableCell>{u.id}</TableCell>
									<TableCell>{u.username ?? "-"}</TableCell>
									<TableCell>{u.email ?? "-"}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{/* Pagination */}
			{total > limit && (
				<div className="py-4 flex justify-center">
					<CustomPagination
						currentPage={currentPage}
						limit={limit}
						totalElements={total}
						onPageChange={(p) => setCurrentPage(p)}
					/>
				</div>
			)}
		</div>
	);
};

export default AdminOrganizationDetailsUsers;
