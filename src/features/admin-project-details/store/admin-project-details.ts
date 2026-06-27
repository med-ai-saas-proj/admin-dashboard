import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminProjectDetailsState {
	projectId: string;
	projectName: string;
}

type AdminProjectDetailsActions = {
	setProjectDetails: (details: Partial<AdminProjectDetailsState>) => void;
	resetProjectDetails: () => void;
};

export const useAdminProjectDetailsStore = create<
	AdminProjectDetailsState & AdminProjectDetailsActions
>()(
	persist(
		(set) => ({
			projectId: "",
			projectName: "",
			setProjectDetails: (details) =>
				set((state) => ({
					...state,
					...details,
				})),
			resetProjectDetails: () =>
				set({
					projectId: "",
					projectName: "",
				}),
		}),
		{
			name: "gantry-project-details",
		}
	)
);
