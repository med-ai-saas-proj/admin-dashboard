import { create } from "zustand";

interface AdminOrganizationDetailsState {
	organizationId: string | null;
}

interface AdminOrganizationDetailsActions {
	setOrganizationId: (id: string | null) => void;
}

type AdminOrganizationDetailsStore = AdminOrganizationDetailsState &
	AdminOrganizationDetailsActions;

export const useAdminOrganizationDetailsStore =
	create<AdminOrganizationDetailsStore>()(() => ({
		organizationId: null,
		setOrganizationId: (id: string | null) => {
			useAdminOrganizationDetailsStore.setState({ organizationId: id });
		},
	}));
