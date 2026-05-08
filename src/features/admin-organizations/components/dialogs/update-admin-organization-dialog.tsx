import { Button } from "@/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Spinner } from "@/components/shadcn/spinner";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useUpdateAdminOrganization } from "../../hooks/use-update-admin-organizations";
import { useGetAdminOrganizations } from "../../hooks/use-get-admin-organizations";
import type { AdminOrganization } from "../../types/admin-organizations";

interface UpdateAdminOrganizationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organization: AdminOrganization | null;
}

export const UpdateAdminOrganizationDialog = ({
	open,
	onOpenChange,
	organization,
}: UpdateAdminOrganizationDialogProps) => {
	const [name, setName] = useState("");

	const { mutate: updateOrganization, isPending } =
		useUpdateAdminOrganization();
	const { refetch } = useGetAdminOrganizations();

	useEffect(() => {
		if (organization) {
			setName(organization.name);
		}
	}, [organization]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !organization) {
			toast.error("Organization name is required");
			return;
		}

		updateOrganization(
			{
				organization_id: organization.org_id,
				name: name.trim(),
			},
			{
				onSuccess: () => {
					toast.success("Organization updated successfully");
					onOpenChange(false);
					refetch();
				},
				onError: () => {
					toast.error("Failed to update organization");
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Organization</DialogTitle>
					<DialogDescription>Edit the organization details</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Organization Name</Label>
						<Input
							id="name"
							placeholder="Enter organization name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isPending}
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? (
								<>
									<Spinner className="mr-2 h-4 w-4" />
									Updating...
								</>
							) : (
								"Update"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
