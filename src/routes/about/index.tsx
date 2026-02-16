import { createFileRoute } from "@tanstack/react-router";

import { Suspense } from "react";
import What from "../../components/about/what";
import Behind from "../../components/about/behind";
import Funding from "../../components/about/funding";
import Who from "../../components/about/who";
import Why from "../../components/about/why";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/about/")({
	component: About,
});

export default function About() {
	return (
		<>
			<Suspense>
				<Tabs defaultValue="what">
					<TabsList variant="underline">
						<TabsTrigger
							value="what"
							variant="underline"
							className="hover:text-foreground text-lg font-semibold text-gray-500"
						>
							What is MetaTrack
						</TabsTrigger>
						<TabsTrigger
							value="people"
							variant="underline"
							className="hover:text-foreground text-lg font-semibold text-gray-500"
						>
							Why MetaTrack
						</TabsTrigger>
						<TabsTrigger
							value="partners"
							variant="underline"
							className="hover:text-foreground text-lg font-semibold text-gray-500"
						>
							Who is MetaTrack for
						</TabsTrigger>
						<TabsTrigger
							value="projects"
							variant="underline"
							className="hover:text-foreground text-lg font-semibold text-gray-500"
						>
							Behind MetaTrack
						</TabsTrigger>
						<TabsTrigger
							value="contact-us"
							variant="underline"
							className="hover:text-foreground text-lg font-semibold text-gray-500"
						>
							Funding MetaTrack
						</TabsTrigger>
					</TabsList>
					<TabsContent value="what">
						<What />
					</TabsContent>
					<TabsContent value="people">
						<Why />
					</TabsContent>
					<TabsContent value="partners">
						<Who />
					</TabsContent>
					<TabsContent value="projects">
						<Behind />
					</TabsContent>
					<TabsContent value="contact-us">
						<Funding />
					</TabsContent>
				</Tabs>
			</Suspense>
		</>
	);
}
