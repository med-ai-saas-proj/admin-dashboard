import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { useMenuLink } from "@/hooks/use-menu-link";
import DashboardLayout from "@/layouts/dashboard-layout";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const AdminOrganizations = (): React.JSX.Element => {
	const location = useLocation();
	const navigate = useNavigate();
	const { organizationsLinks } = useMenuLink();
	const { t } = useTranslation("admin-organization");

	const currentTab =
		location.pathname.split("/").pop() || organizationsLinks[0].value;

	return (
		<DashboardLayout pageTitle="Organizations">
			<h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
			<Tabs value={currentTab} onValueChange={(value) => navigate(value)}>
				<div className="border-b w-full">
					<TabsList variant={"line"}>
						{organizationsLinks.map((link) => (
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

export default AdminOrganizations;
