import "i18next";
import type settingEN from "../public.locales/en/setting.json";
import type signinEN from "../public.locales/en/sign-in.json";
import type sidebarEN from "../public.locales/en/sidebar.json";
import type commonEN from "../public.locales/en/common.json";
import type billingEN from "../public.locales/en/billing.json";
import type menuEN from "../public.locales/en/menu.json";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: "common";
		resources: {
			setting: typeof settingEN;
			"sign-in": typeof signinEN;
			sidebar: typeof sidebarEN;
			common: typeof commonEN;
			billing: typeof billingEN;
			menu: typeof menuEN;
		};
	}
}
