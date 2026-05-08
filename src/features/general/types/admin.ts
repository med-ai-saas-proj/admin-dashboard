export type AdminMe = {
	id: string;
	username: string | null;
	email: string | null;
};

export type AdminSummary = {
	organizations: number;
	projects: number;
	api_keys: number;
	users: number;
};
