import { useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { useAdminProjectDetailsStore } from "@/features/admin-project-details/store/admin-project-details";

const AdminProjectDetails = (): React.JSX.Element => {
	const { projectId } = useParams<{ projectId: string }>();

	useEffect(() => {
		useAdminProjectDetailsStore
			.getState()
			.setProjectDetails({ projectId: projectId });
	}, [projectId]);

	return <Outlet />;
};

export default AdminProjectDetails;
