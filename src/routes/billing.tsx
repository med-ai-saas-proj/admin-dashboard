import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { useMenuLink } from "@/hooks/use-menu-link";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const BillingDashboard = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { billingLinks } = useMenuLink();

	const currentTab =
		location.pathname.split("/").pop() || billingLinks[0].value;

	return (
		<DashboardLayout pageTitle="Billing">
			<h2 className="text-2xl font-bold mb-4">Billing</h2>
			<Tabs value={currentTab} onValueChange={(value) => navigate(value)}>
				<div className="border-b w-full">
					<TabsList variant={"line"}>
						{billingLinks.map((link) => (
							<TabsTrigger key={link.key} value={link.value}>
								{link.title}
							</TabsTrigger>
						))}
					</TabsList>
				</div>
			</Tabs>
			<Outlet />
		</DashboardLayout>
	);
};

export default BillingDashboard;
