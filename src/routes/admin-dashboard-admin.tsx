import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import { Card } from "@/components/shadcn/card";
import { useGetAdminMe } from "@/features/general/hooks/use-get-admin-me";
import { useGetAdminSummary } from "@/features/general/hooks/use-get-admin-summary";

const GeneralAdmin = (): React.JSX.Element => {
	const { data: adminMe } = useGetAdminMe();
	const { data: adminSummary } = useGetAdminSummary();

	const summaryCards = [
		{ title: "Organizations", value: adminSummary?.organizations },
		{ title: "Projects", value: adminSummary?.projects },
		{ title: "API Keys", value: adminSummary?.api_keys },
		{ title: "Users", value: adminSummary?.users },
	];

	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold mb-2">General Admin Information</h1>
				<p className="text-sm text-muted-foreground">
					Overview of your admin account and key metrics
				</p>
			</div>
			<div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
				<Card className="p-6 flex- items-center justify-center">
					<div className="flex flex-col gap-6">
						<Avatar className="h-16 w-16 mx-auto">
							<AvatarFallback className="text-lg font-semibold">
								{adminMe?.username?.charAt(0)?.toUpperCase() || "A"}
							</AvatarFallback>
						</Avatar>

						<div className="space-y-3 text-sm">
							<div className="flex items-center gap-x-4">
								<p className="text-muted-foreground">ID</p>
								<p className="font-medium break-all">{adminMe?.id}</p>
							</div>
							<div className="flex items-center gap-x-4">
								<p className="text-muted-foreground">Username</p>
								<p className="font-medium break-all">{adminMe?.username}</p>
							</div>
							<div className="flex items-center gap-x-4">
								<p className="text-muted-foreground">Email</p>
								<p className="font-medium break-all">{adminMe?.email}</p>
							</div>
						</div>
					</div>
				</Card>

				<div className="grid gap-6 sm:grid-cols-2">
					{summaryCards.map((card) => (
						<Card key={card.title} className="p-6">
							<div className="flex h-full min-h-18 flex-col items-end justify-between text-right">
								<div className="text-sm font-medium text-muted-foreground">
									{card.title}
								</div>
								<div className="text-3xl font-semibold tracking-tight">
									{card.value}
								</div>
							</div>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default GeneralAdmin;
