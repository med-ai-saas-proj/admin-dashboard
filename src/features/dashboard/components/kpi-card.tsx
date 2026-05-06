import { ArrowDown, ArrowUp } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/card";
import type { StatCardData } from "../dashboard.type";
import { FormatValue } from "../utils/format-stat.utils";
import { useTranslation } from "react-i18next";

const KPICard = ({ data }: { data: StatCardData }) => {
	const { t } = useTranslation("dashboard");
	const formattedValue = FormatValue(data.value, data.format || "compact");

	return (
		<Card className="min-w-xs">
			<CardHeader>
				<CardTitle>
					<p className="font-medium text-muted-foreground text-nowrap">
						{t(`kpiCard.${data.title}`)}
					</p>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="font-bold text-4xl">{formattedValue}</p>
			</CardContent>
			{data.change && (
				<CardFooter>
					<div className="flex items-center">
						{data.change.type === "increase" ? (
							<ArrowUp className="mr-1 text-muted-foreground" size={16} />
						) : (
							<ArrowDown className="mr-1 text-muted-foreground" size={16} />
						)}
						<p className="text-muted-foreground">
							{data.change?.value}%{" "}
							{t(`kpiCard.change.${data.change?.compareLabel}`)}
						</p>
					</div>
				</CardFooter>
			)}
		</Card>
	);
};

export default KPICard;
