import { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogClose,
	DialogFooter,
} from "@/components/shadcn/dialog";
import { Users } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import type { UserProfileInfo } from "../../types/admin";

const UserOrganizationsDialog = ({
	username,
	organizations,
	isProfileLoading,
}: {
	username: string;
	organizations?: UserProfileInfo["organizations"];
	isProfileLoading?: boolean;
}): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const userOrganizations = organizations ?? [];

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button
					type="button"
					aria-label="View organizations"
					className="hover:text-primary transition-colors"
					title="View organizations"
				>
					<Users className="h-4 w-4" />
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<h2 className="text-lg font-semibold mb-4">
					Organizations for User: {username}
				</h2>
				{isProfileLoading ? (
					<p className="text-sm text-muted-foreground">
						Loading organizations...
					</p>
				) : userOrganizations.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						This user does not belong to any organizations.
					</p>
				) : (
					<ul className="space-y-2">
						{userOrganizations.map((org) => (
							<li key={org.id} className="border rounded-md p-3 bg-slate-50">
								<p className="font-medium">{org.name}</p>
								<div className="flex items-center gap-x-2 mt-2">
									<p className="text-sm text-muted-foreground">ID: {org.id}</p>
									<div className="border h-4" />
									<p className="text-sm text-muted-foreground">
										Alias: {org.alias}
									</p>
								</div>
							</li>
						))}
					</ul>
				)}
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="default">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UserOrganizationsDialog;
