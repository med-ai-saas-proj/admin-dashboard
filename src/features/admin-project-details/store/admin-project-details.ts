import { create } from "zustand";

interface AdminProjectDetailsState {
	projectId: string;
	projectName: string;
	organizationId: string;
	organizationName: string;
}

type AdminProjectDetailsActions = {
	setProjectDetails: (details: Partial<AdminProjectDetailsState>) => void;
};

export const useAdminProjectDetailsStore = create<
	AdminProjectDetailsState & AdminProjectDetailsActions
>((set) => ({
	projectId: "",
	projectName: "",
	organizationId: "",
	organizationName: "",
	setProjectDetails: (details) => set((state) => ({ ...state, ...details })),
}));
