import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/resources")({
	component: ResourcesPage,
});

const resources = [
	{
		title: "DATA MANAGEMENT PLAN",
		description:
			"Create, manage and maintain Data Management Plans aligned with FAIR principles and funding requirements.",
		link: "https://elixir.no/services/dsw",
		image: "/logos/resources/dsw.png",
	},
	{
		title: "METADATA MANAGEMENT",
		description:
			"Manage and curate metadata for life-science projects, ensuring discoverability and interoperability.",
		link: "https://www.microbial-data-platform.no/",
		image: "/logos/resources/elixir-no-logo-black.svg",
	},
	{
		title: "DATA STORAGE",
		description:
			"Secure storage and sharing of research data throughout the entire research lifecycle.",
		link: "https://nels.elixir.no",
		image: "/logos/resources/nels.png",
	},
	{
		title: "PATHOGENS PORTAL",
		description:
			"Explore pathogen-related datasets and resources for infectious disease research and surveillance.",
		link: "https://www.pathogens.no",
		image: "/logos/resources/pathogens_logo-white.png",
	},
	{
		title: "DATA ANALYSIS",
		description:
			"Run reproducible bioinformatics analyses through Galaxy workflows and scientific tools.",
		link: "https://usegalaxy.org",
		image: "/logos/resources/galaxy.png",
	},
];

function ResourcesPage() {
	return (
		<div className="mx-auto max-w-7xl px-6 py-12">
			<div className="mb-12 text-center">
				<h1 className="text-4xl font-bold">Resources</h1>

				<p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg">
					Explore services and platforms provided by ELIXIR Norway and
					collaborating infrastructures supporting data management, metadata
					curation, storage, sharing and analysis.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				{resources.map((resource) => (
					<Card
						key={resource.title}
						className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
					>
						<CardHeader className="flex flex-col items-center">
							<div className="flex h-24 w-full items-center justify-center">
								<img
									src={resource.image}
									alt={resource.title}
									className="max-h-full max-w-[260px] object-contain"
								/>
							</div>

							<CardTitle className="text-center">{resource.title}</CardTitle>
						</CardHeader>

						<CardContent className="flex flex-1 flex-col">
							<CardDescription className="flex-1 text-center text-base">
								{resource.description}
							</CardDescription>

							<Button asChild className="mt-6">
								<a
									href={resource.link}
									target="_blank"
									rel="noopener noreferrer"
								>
									Learn More
									<ExternalLink />
								</a>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
