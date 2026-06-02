import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type MonthFormat = "number" | "letters";

const getStoredLanguage = () => {
	if (typeof window === "undefined") {
		return "en";
	}
	return window.localStorage.getItem("i18nextLng") ?? "en";
};

export function getUserGmtOffset(): string {
	const offsetMinutes = new Date().getTimezoneOffset();
	const totalMinutes = -offsetMinutes;
	const sign = totalMinutes >= 0 ? "+" : "-";
	const absMinutes = Math.abs(totalMinutes);
	const hours = Math.floor(absMinutes / 60);
	const minutes = absMinutes % 60;

	return minutes > 0
		? `GMT${sign}${hours}:${String(minutes).padStart(2, "0")}`
		: `GMT${sign}${hours}`;
}

export function getUserGmtOffsetHours(): number {
	return -(new Date().getTimezoneOffset() / 60);
}

function normalizeToUtc(isoTime: string): Date {
	// If no timezone suffix, the backend sent a naive UTC timestamp — append Z
	const hasTimezone = /Z|[+-]\d{2}:\d{2}$/.test(isoTime);
	return new Date(hasTimezone ? isoTime : `${isoTime}Z`);
}

function toLocalDate(date: Date): Date {
	const offsetMs = -date.getTimezoneOffset() * 60 * 1000;
	return new Date(date.getTime() + offsetMs);
}

export function formatIsoDate(
	isoTime: string,
	options: {
		monthFormat?: MonthFormat;
		showTime?: boolean;
		showSeconds?: boolean;
	} = {}
) {
	const utcDate = normalizeToUtc(isoTime);

	if (Number.isNaN(utcDate.getTime())) {
		return "";
	}

	const monthFormat = options.monthFormat ?? "number";
	const showTime = options.showTime ?? false;
	const showSeconds = options.showSeconds ?? false;
	const locale = getStoredLanguage();

	const date = toLocalDate(utcDate);

	const dd = String(date.getUTCDate()).padStart(2, "0");
	const mm =
		monthFormat === "letters"
			? date.toLocaleString(locale, { month: "short", timeZone: "UTC" })
			: String(date.getUTCMonth() + 1).padStart(2, "0");
	const yyyy = date.getUTCFullYear();

	const datePart =
		locale === "en" || locale.startsWith("en-")
			? `${mm}/${dd}/${yyyy}`
			: `${dd}/${mm}/${yyyy}`;

	if (!showTime) {
		return datePart;
	}

	const hh = String(date.getUTCHours()).padStart(2, "0");
	const min = String(date.getUTCMinutes()).padStart(2, "0");
	const timePart = showSeconds
		? `${hh}:${min}:${String(date.getUTCSeconds()).padStart(2, "0")}`
		: `${hh}:${min}`;

	return `${datePart} ${timePart}`;
}

export function formatIsoDateWithGmt(
	isoTime: string,
	options: {
		monthFormat?: MonthFormat;
		showTime?: boolean;
		showSeconds?: boolean;
		showGmt?: boolean;
	} = {}
) {
	const showGmt = options.showGmt ?? false;
	const formatted = formatIsoDate(isoTime, options);

	if (!formatted) {
		return "";
	}

	if (!showGmt || !options.showTime) {
		return formatted;
	}

	return `${formatted} (${getUserGmtOffset()})`;
}
