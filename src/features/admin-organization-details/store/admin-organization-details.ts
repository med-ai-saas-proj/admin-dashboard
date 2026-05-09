import { create } from "zustand";

interface AdminOrganizationDetailsState {
	organizationId: string | null;
}

interface AdminOrganizationDetailsActions {
	setOrganizationId: (id: string | null) => void;
}

type AdminOrganizationDetailsStore = AdminOrganizationDetailsState &
	AdminOrganizationDetailsActions;

export const adminOrganizationDetailsStore =
	create<AdminOrganizationDetailsStore>()(() => ({
		organizationId: null,
		setOrganizationId: (id: string | null) => {
			adminOrganizationDetailsStore.setState({ organizationId: id });
		},
	}));
