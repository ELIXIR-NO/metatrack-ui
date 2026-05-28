import { createFileRoute } from "@tanstack/react-router";

import { Suspense } from "react";
import What from "../../components/about/what";
import Behind from "../../components/about/behind";
import Funding from "../../components/about/funding";
import Who from "../../components/about/who";
import Why from "../../components/about/why";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function About() {
	return (
		<Suspense>
			<Tabs defaultValue="what">
				<TabsList variant="line"  className="flex justify-center w-full">
					<TabsTrigger value="what" className="hover:text-foreground text-lg font-semibold text-gray-500">
						What is MetaTrack
					</TabsTrigger>

					<TabsTrigger value="people" className="hover:text-foreground text-lg font-semibold text-gray-500">
						Why MetaTrack
					</TabsTrigger>

					<TabsTrigger value="partners" className="hover:text-foreground text-lg font-semibold text-gray-500">
						Who is MetaTrack for
					</TabsTrigger>

					<TabsTrigger value="projects" className="hover:text-foreground text-lg font-semibold text-gray-500">
						Behind MetaTrack
					</TabsTrigger>

					<TabsTrigger value="contact-us" className="hover:text-foreground text-lg font-semibold text-gray-500">
						Funding MetaTrack
					</TabsTrigger>
				</TabsList>
				
				<TabsContent value="what" className="min-h-[70vh]">
					<What />
				</TabsContent>

				<TabsContent value="people" className="min-h-[70vh]">
					<Why />
				</TabsContent>

				<TabsContent value="partners" className="min-h-[70vh]">
					<Who />
				</TabsContent>

				<TabsContent value="projects" className="min-h-[70vh]">
					<Behind />
				</TabsContent>

				<TabsContent value="contact-us" className="min-h-[70vh]">
					<Funding />
				</TabsContent>
			</Tabs>
		</Suspense>
	);
}

export const Route = createFileRoute("/about/")({
	component: About,
});
