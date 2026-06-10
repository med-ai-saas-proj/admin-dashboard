import Mock from "mockjs";

import { API_ROUTES } from "@/config/api-routes";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const aggregatesOrganizationUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/aggregates/organizations(?:[?].*)?$`
);

const aggregatesProjectsUrl = new RegExp(
	`^${escapeRegExp(API_ROUTES.MANAGEMENT.BILLING)}/aggregates/projects(?:[?].*)?$`
);

const formatDateISO = (d: Date, period: string) => {
	if (period === "monthly") {
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
	}
	// default to date string YYYY-MM-DD
	return d.toISOString().slice(0, 10);
};

const generateBuckets = (
	periodStartStr: string | null,
	periodEndStr: string | null,
	period: string | null
) => {
	const now = new Date();
	const start = periodStartStr
		? new Date(periodStartStr)
		: new Date(now.getTime() - 6 * 24 * 3600 * 1000);
	const end = periodEndStr ? new Date(periodEndStr) : now;

	// fallback if invalid
	if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
		const fallbackEnd = now;
		const fallbackStart = new Date(now.getTime() - 6 * 24 * 3600 * 1000);
		return generateBuckets(
			fallbackStart.toISOString(),
			fallbackEnd.toISOString(),
			"daily"
		);
	}

	const bucketsCount = 7;
	const startTs = start.getTime();
	const endTs = end.getTime();
	const step = Math.max(
		Math.floor((endTs - startTs) / Math.max(bucketsCount - 1, 1)),
		24 * 3600 * 1000
	);

	const arr = Array.from({ length: bucketsCount }).map((_, idx) => {
		const ts = startTs + step * idx;
		const d = new Date(ts);
		return {
			period_bucket: formatDateISO(d, period ?? "daily"),
			transaction_count: Mock.Random.integer(0, 500),
			total_amount: Mock.Random.float(0, 50000, 2, 2).toFixed(2),
		};
	});

	return arr;
};

Mock.mock(aggregatesOrganizationUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const periodStart = requestUrl.searchParams.get("period_start");
	const periodEnd = requestUrl.searchParams.get("period_end");
	const period = requestUrl.searchParams.get("period");

	const data = generateBuckets(periodStart, periodEnd, period);

	return {
		success: true,
		data,
	};
});

Mock.mock(aggregatesProjectsUrl, "get", (options: { url: string }) => {
	const requestUrl = new URL(options.url);
	const periodStart = requestUrl.searchParams.get("period_start");
	const periodEnd = requestUrl.searchParams.get("period_end");
	const period = requestUrl.searchParams.get("period");
	// project_uids may be sent as repeated params or array - ignore for now and return aggregated buckets

	const data = generateBuckets(periodStart, periodEnd, period);

	return {
		success: true,
		data,
	};
});
