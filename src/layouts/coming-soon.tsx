import { Button } from "@/components/shadcn/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ComingSoonPage = (): React.JSX.Element => {
	const { t } = useTranslation("coming-soon");

	return (
		<section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
			<div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
			<div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />

			<div className="relative flex w-full max-w-2xl flex-col items-center gap-6 text-center">
				<p className="text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
					{t("eyebrow")}
				</p>
				<div className="space-y-3">
					<h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
						{t("title")}
					</h1>
					<p className="mx-auto max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
						{t("description")}
					</p>
				</div>

				<Button asChild size="lg" className="rounded-full px-8">
					<Link to="/management/organizations">{t("action")}</Link>
				</Button>
			</div>
		</section>
	);
};

export default ComingSoonPage;
