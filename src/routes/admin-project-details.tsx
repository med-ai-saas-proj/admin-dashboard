import { useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import DashboardLayout from "@/layouts/dashboard-layout";
import { useAdminProjectDetailsStore } from "@/features/admin-project-details/store/admin-project-details";

const AdminProjectDetails = (): React.JSX.Element => {
	const { projectId } = useParams<{ projectId: string }>();

	useEffect(() => {
		useAdminProjectDetailsStore
			.getState()
			.setProjectDetails({ projectId: projectId });
	}, [projectId]);

	return (
		<DashboardLayout pageTitle="Projects">
			<Outlet />
		</DashboardLayout>
	);
};

export default AdminProjectDetails;
