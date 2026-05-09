import DashboardLayout from "@/layouts/dashboard-layout";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { adminOrganizationDetailsStore } from "@/features/admin-organization-details/store/admin-organization-details";

const AdminOrganizationDetails = (): React.JSX.Element => {
	const { orgId } = useParams<{ orgId: string }>();

	useEffect(() => {
		adminOrganizationDetailsStore.getState().setOrganizationId(orgId ?? null);
	}, [orgId]);

	return (
		<DashboardLayout pageTitle="Organizations">
			<Outlet />
		</DashboardLayout>
	);
};

export default AdminOrganizationDetails;
