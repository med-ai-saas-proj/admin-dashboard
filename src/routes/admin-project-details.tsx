import { useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { useAdminProjectDetailsStore } from "@/features/admin-project-details/store/admin-project-details";
import { useGetAdminProjectDetails } from "@/features/admin-project-details/hooks/use-get-admin-project-details";

const AdminProjectDetails = (): React.JSX.Element => {
	const { projectId } = useParams<{ projectId: string }>();
	const { data: projectDetails } = useGetAdminProjectDetails(projectId || "");

	useEffect(() => {
		useAdminProjectDetailsStore.getState().setProjectDetails({
			projectId: projectId,
			projectName: projectDetails?.name || "",
		});
	}, [projectId, projectDetails]);

	return <Outlet />;
};

export default AdminProjectDetails;
