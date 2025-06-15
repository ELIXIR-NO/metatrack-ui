import { createFileRoute } from "@tanstack/react-router";
import CardGrid from "@/components/cards/card-grid";
import StatCardGrid from "@/components/cards/stat-card-grid";
import type { CardGridData } from "@/components/cards/types";
import { LogosModeToggle } from "@/components/logos-mode-toggle";
import { statCards } from "@/lib/data/statCards";
import { ThemeImage } from "@/components/theme-image";
import QuickStart from "@/components/quick-start";

export const Route = createFileRoute("/")({
	component: Index,
});

const resources: CardGridData[] = [
	{
		title: "Pathogen Platform Norway",
		description: "",
		link: "https://www.pathogens.no",
		image: (
			<ThemeImage
				lightSrc={"/pathogens_portal_norway_logo_dark.png"}
				darkSrc={"/pathogens_portal_norway_logo_light.png"}
				alt={"Pathogen Logo"}
			/>
		),
	},
	{
		title: "Elixir Page",
		description: "",
		link: "https://www.elixir.no",
		image: (
			<LogosModeToggle
				className="aspect-video object-contain hover:ring-0"
				width={400}
				height={250}
			/>
		),
	},
];

function Index() {
	return (
		<div className="flex flex-col items-center space-y-12 text-justify">
			<div className="flex flex-col gap-12">
				<div className="flex flex-col">
					<h1 className="text-bold text-justify lg:text-left">
						Open Platform for Metadata Management and Tracking
					</h1>
					<h4 className="text-justify font-normal lg:text-left">
						For life scientists in Norway
					</h4>
					<a href="https://elixir.no" className="text-muted-foreground text-lg">
						By Elixir Norway
					</a>
				</div>

				<QuickStart />
				<div className="w-full rounded-md bg-gray-100 p-6">
					<h2 className="text-center text-black lg:text-left">Resources</h2>
					<CardGrid data={resources} className="lg:grid-cols-2" />
				</div>
				<StatCardGrid data={statCards} />
			</div>
		</div>
	);
}
