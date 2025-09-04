import { createFileRoute } from "@tanstack/react-router";
import { Check, CloudUpload, Search, Settings } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

export const Route = createFileRoute("/about")({
	component: About,
});

interface CheckItemProps {
	text: string;
}

function CheckItem({ text }: CheckItemProps) {
	const [boldText, ...rest] = text.split(" - ");
	const normalText = rest.join(" - ");

	return (
		<div className="flex items-center space-x-3 pb-6">
			<div className="bg-primary text-secondary flex h-8 w-8 items-center justify-center rounded-lg">
				<Check size={20} />
			</div>
			<p className="flex-1 text-lg">
				<strong>{boldText}</strong>
				{normalText && ` - ${normalText}`}
			</p>
		</div>
	);
}

function About() {
	return (
		<>
			<section className="bg-primary text-secondary relative right-1/2 left-1/2 -mx-[50vw] w-screen py-16">
				<h4 className="max-w-5xl px-16 text-justify leading-relaxed lg:mx-auto xl:px-0">
					A central hub to upload, organise, and explore contextual data from
					life sciences including bioinformatics, and health research. Whether
					you are managing complex datasets or seeking structured insights,
					MetaTrack platform streamlines your metadata workflow; making
					collaboration, discovery, and data reuse effortless.
				</h4>
			</section>

			<section className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-12 md:grid-cols-2">
				<div>
					<h3 className="mb-4 flex items-center font-semibold">
						Benefits with using MetaTrack
					</h3>
					<CheckItem text="Collaborative metadata management - invite collaborators into your project" />
					<CheckItem text="Access controlled system - login with your FEIDE user" />
					<CheckItem text="Directly connected with data brokering service - to public archives" />
				</div>
				<div className="grid gap-6">
					<Card>
						<CardHeader className="flex items-start space-x-2">
							<CloudUpload size={56} strokeWidth={1} />
							<div className="flex-1">
								<CardTitle className="pb-2">MetaData Uploaders</CardTitle>
								<CardDescription>
									Add and structure your metadata with precision. Upload data
									with templates that support downstream use and deposition.
								</CardDescription>
							</div>
						</CardHeader>
					</Card>

					<Card className="md:-mr-12 md:ml-12">
						<CardHeader className="flex items-start space-x-2">
							<Settings size={56} strokeWidth={1} />
							<div className="flex-1">
								<CardTitle className="pb-2">MetaData Curators</CardTitle>
								<CardDescription>
									Maintain quality, consistency, and interoperability through
									reviewing metadata.
								</CardDescription>
							</div>
						</CardHeader>
					</Card>

					<Card className="md:-mr-24 md:ml-24">
						<CardHeader className="flex items-start space-x-2">
							<Search size={56} strokeWidth={1} />
							<div className="flex-1">
								<CardTitle className="pb-2">MetaData Explorers</CardTitle>
								<CardDescription>
									The React Framework created and maintained by{" "}
									<a
										className="color: var(--chart-5) hover:underline"
										href="https://vercel.com"
									>
										@vercel
									</a>
									.
								</CardDescription>
							</div>
						</CardHeader>
					</Card>
				</div>
			</section>
		</>
	);
}
