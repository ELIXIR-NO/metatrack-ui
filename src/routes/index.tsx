import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Fingerprint, Upload } from "lucide-react";
import CardGrid, { CardGridData } from "@/components/card-grid";

export const Route = createFileRoute("/")({
	component: Index,
});

const resources: CardGridData[] = [
	{
		title: "Pathogen Platform Norway",
		description: "",
		link: "/",
		image: "/",
	},
	{
		title: "Other Page",
		description: "",
		link: "/",
		image: "",
	},
];

function Index() {
	return (
		<div className="flex flex-col items-center space-y-12 text-justify">
			<div className="flex max-w-full flex-col gap-12">
				<div className="flex flex-col">
					<h2 className="text-justify lg:text-left">
						Open Platform for Metadata Management and Tracking
					</h2>
					<h4 className="text-justify font-normal lg:text-left">
						For life scientists in Norway
					</h4>
					<a href="https://elixir.no" className="text-muted-foreground text-lg">
						By Elixir Norway
					</a>
				</div>

				<div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-between">
					<div className="flex flex-col items-center">
						<BookOpen size={150} />
						<Button className="mt-4 h-14 rounded-md px-6 has-[>svg]:px-4">
							GET STARTED
						</Button>
					</div>
					<div className="flex flex-col items-center">
						<Upload size={150} />
						<Button className="mt-4 h-14 rounded-md px-6 has-[>svg]:px-4">
							UPLOAD DATA
						</Button>
					</div>
					<div className="flex flex-col items-center">
						<Fingerprint size={150} />
						<Button className="mt-4 h-14 rounded-md px-6 has-[>svg]:px-4">
							DATA ACCESS
						</Button>
					</div>
				</div>
			</div>
			<div className="rounded-md bg-gray-100 p-6">
				<h2 className="text-center lg:text-left">Resources</h2>
				<CardGrid data={resources} className="lg:grid-cols-2" />
			</div>
			<div className="rounded-md bg-gray-100 p-6">
				<h2 className="text-center lg:text-left">Numbers Behind MetaTrack</h2>
				<CardGrid data={resources} className="lg:grid-cols-2" />
			</div>
		</div>
	);
}
