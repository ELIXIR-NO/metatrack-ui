import { createFileRoute } from "@tanstack/react-router";
import CardGrid from "@/components/cards/card-grid";
import StatCardGrid from "@/components/cards/stat-card-grid";
import type { CardGridData } from "@/components/cards/types";
import { LogosModeToggle } from "@/components/logos-mode-toggle";
import { statCards } from "@/lib/data/statCards";
import { ThemeImage } from "@/components/theme-image";
import QuickStart from "@/components/quick-start";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
	component: Index,
});

const resources: CardGridData[] = [
	{
		title: "",
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
		title: "",
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
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 1.2 }}
		>
			<div className="flex flex-col items-center space-y-16">
				{/* HERO SECTION */}
				<section className="relative flex h-150 w-full items-center justify-center overflow-hidden">
					<ThemeImage
						lightSrc="/bg-light.jpg"
						darkSrc="/bg-light.jpg"
						alt="Background"
						className="absolute inset-0 h-150 w-full object-cover"
					/>

					<div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

					<div className="relative z-10 max-w-3xl px-6 text-center">
						<h1 className="animate-fade-in mb-4 text-4xl font-bold text-white lg:text-6xl">
							Open Platform for Metadata Management and Tracking
						</h1>
						<h4 className="animate-fade-in mb-6 text-lg text-gray-200 lg:text-2xl">
							For life scientists in Norway
						</h4>
						<a
							href="https://elixir.no"
							className="flex flex-col items-center px-6 py-3 font-medium text-white shadow-lg"
						>
							By Elixir Norway
						</a>
					</div>
				</section>

				{/* QUICK START */}

				<QuickStart />

				{/* STAT CARDS */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8 }}
				>
					<StatCardGrid data={statCards} />
				</motion.div>

				{/* RESOURCES */}

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8 }}
				>
					<div className="w-[75vw]">
						<div className="bg-secondary flex flex-col items-center rounded-md pb-4 text-center shadow-lg">
							<h3 className="text-primary pt-4 text-center font-semibold lg:text-left">
								Resources
							</h3>
							<CardGrid data={resources} />
						</div>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}

export default Index;
