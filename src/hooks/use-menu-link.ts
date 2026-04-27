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
	];

	return { dashboardLinks, billingLinks };
};
