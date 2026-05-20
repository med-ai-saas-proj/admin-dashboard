import { useTranslation } from "react-i18next";

type MenuLink = {
	key: string;
	title: React.ReactNode;
	value: string;
};

export const useMenuLink = () => {
	const { t } = useTranslation("menu");

	const dashboardLinks: MenuLink[] = [
		{
			key: "billing",
			title: t("dashboard.billing"),
			value: "billing",
		},
	];

	const organizationsLinks: MenuLink[] = [
		{
			key: "overview",
			title: t("organizations.overview"),
			value: "overview",
		},
		{
			key: "permissions",
			title: t("organizations.permissions"),
			value: "permissions",
		},
	];

	const projectsLinks: MenuLink[] = [
		{
			key: "overview",
			title: t("projects.overview"),
			value: "overview",
		},
		{
			key: "permissions",
			title: t("projects.permissions"),
			value: "permissions",
		},
	];

	const apikeysLinks: MenuLink[] = [
		{
			key: "overview",
			title: t("apiKeys.overview"),
			value: "overview",
		},
		{
			key: "permissions",
			title: t("apiKeys.permissions"),
			value: "permissions",
		},
	];

	const billingLinks: MenuLink[] = [
		{
			key: "overview",
			title: t("billing.overview"),
			value: "overview",
		},
		{
			key: "invoices",
			title: t("billing.invoices"),
			value: "invoices",
		},
		{
			key: "credits",
			title: t("billing.credits"),
			value: "credits",
		},
		{
			key: "aggregate",
			title: t("billing.aggregate"),
			value: "aggregate",
		},
	];

	return {
		dashboardLinks,
		organizationsLinks,
		projectsLinks,
		apikeysLinks,
		billingLinks,
	};
};
