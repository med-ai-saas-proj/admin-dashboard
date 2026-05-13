import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { useMenuLink } from "@/hooks/use-menu-link";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const AdminApiKeysPage = (): React.JSX.Element => {
	const location = useLocation();
	const navigate = useNavigate();
	const { apikeysLinks } = useMenuLink();

	const currentTab =
		location.pathname.split("/").pop() || apikeysLinks[0].value;

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold mb-4">API Keys Dashboard</h2>
			<Tabs value={currentTab} onValueChange={(value) => navigate(value)}>
				<div className="border-b w-full">
					<TabsList variant={"line"}>
						{apikeysLinks.map((link) => (
							<TabsTrigger key={link.key} value={link.value}>
								{link.title}
							</TabsTrigger>
						))}
					</TabsList>
				</div>
			</Tabs>
			<Outlet />
		</div>
	);
};

export default AdminApiKeysPage;
