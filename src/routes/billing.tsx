import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import DashboardLayout from "@/layouts/dashboard-layout";
import { useLocation, useNavigate } from "react-router-dom";

const BillingDashboard = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const currentTab = location.pathname.split("/").pop();

	return (
		<DashboardLayout pageTitle="Billing">
			<h2 className="text-2xl font-bold mb-4">Billing</h2>
			<Tabs value={currentTab} onValueChange={(value) => navigate(value)}>
				<div className="border-b w-full">
					<TabsList variant={"line"}>
						<TabsTrigger value="invoices">Invoices</TabsTrigger>
						<TabsTrigger value="credits">Credits</TabsTrigger>
					</TabsList>
				</div>
			</Tabs>
		</DashboardLayout>
	);
};

export default BillingDashboard;
