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
import { useState } from "react";
import { useCreateAdminOrganization } from "../../hooks/use-create-admin-organizations";
import { useGetAdminOrganizations } from "../../hooks/use-get-admin-organizations";

interface CreateAdminOrganizationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const CreateAdminOrganizationDialog = ({
	open,
	onOpenChange,
}: CreateAdminOrganizationDialogProps) => {
	const [name, setName] = useState("");
	const [alias, setAlias] = useState("");
	const [ownerId, setOwnerId] = useState("");

	const { mutate: createOrganization, isPending } =
		useCreateAdminOrganization();
	const { refetch } = useGetAdminOrganizations();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error("Organization name is required");
			return;
		}

		createOrganization(
			{
				name: name.trim(),
				alias: alias.trim() || null,
				owner_id: ownerId.trim() || null,
			},
			{
				onSuccess: () => {
					toast.success("Organization created successfully");
					setName("");
					setAlias("");
					setOwnerId("");
					onOpenChange(false);
					refetch();
				},
				onError: () => {
					toast.error("Failed to create organization");
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Organization</DialogTitle>
					<DialogDescription>
						Add a new organization to the system
					</DialogDescription>
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

					<div className="space-y-2">
						<Label htmlFor="alias">Alias</Label>
						<Input
							id="alias"
							placeholder="Enter organization alias (optional)"
							value={alias}
							onChange={(e) => setAlias(e.target.value)}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="owner-id">Owner ID</Label>
						<Input
							id="owner-id"
							placeholder="Enter owner ID (optional)"
							value={ownerId}
							onChange={(e) => setOwnerId(e.target.value)}
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
									Creating...
								</>
							) : (
								"Create"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
