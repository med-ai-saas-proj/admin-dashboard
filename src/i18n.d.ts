import "i18next";
import type settingEN from "../public.locales/en/setting.json";
import type signinEN from "../public.locales/en/sign-in.json";
import type sidebarEN from "../public.locales/en/sidebar.json";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: "common";
		resources: {
			setting: typeof settingEN;
			"sign-in": typeof signinEN;
			sidebar: typeof sidebarEN;
		};
	}
}
