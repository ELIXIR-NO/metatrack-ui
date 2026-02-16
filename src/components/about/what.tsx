import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CheckItemProps {
	title?: string;
	description?: string;
}

const checkItems: Array<CheckItemProps> = [
	{
		title: "Collaborative metadata management",
		description: "Invite collaborators into your project",
	},
	{
		title: "Access controlled system",
		description: "Login with your FEIDE user",
	},
	{
		title: "User-friendly interface",
		description: "Easy to add and edit metadata connected to your data",
	},
	{
		title: "Support and training",
		description: "Through ELIXIR Norway support desk",
	},
	{
		title: "Directly connected with data brokering service",
		description: "To public archives",
	},
	{
		title: "Ensures standardised and FAIR data",
		description: "Following international best practices",
	},
	{
		title: "Facilitates early data discovery",
		description: "Share selected metadata even before formal publication",
	},
	{
		title: "Integrated with national infrastructure",
		description: "Align with Norwegian and European data policies",
	},
	{
		title: "Enables reproducible science",
		description: "Structured metadata ensures transparency and traceability",
	},
];

export default function What() {
	return (
		<>
			<div className="max-w-6xl space-y-4 text-justify text-xl leading-relaxed lg:mx-auto lg:py-4">
				<h5>
					MetaTrack is a web-based platform for managing, sharing, and exploring
					life-science data and associated metadata. It provides a secure and
					user-friendly environment where researchers can organise datasets,
					capture contextual information, and collaborate efficiently across
					projects and institutions.
				</h5>
				<h5>
					By structuring data and metadata in a consistent and interoperable
					way, MetaTrack supports better data stewardship throughout the
					research lifecycle and helps ensure that datasets are
					publication-ready for submission to public repositories.
				</h5>
			</div>

			<section className="mx-auto max-w-7xl px-6 py-12">
				<h3 className="mb-4 text-center text-xl font-semibold">
					What MetaTrack Offers
				</h3>

				<div className="grid grid-cols-3 gap-4 bg-gray-100 p-2">
					{checkItems.map((check, index) => (
						<Card
							key={index}
							className="h-full transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
						>
							<CardHeader className="flex flex-row items-center gap-3">
								<div className="text-secondary flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600">
									<Check size={14} />
								</div>

								<CardTitle>{check.title}</CardTitle>
							</CardHeader>

							<CardContent className="flex flex-col">
								<p className="text-justify text-base whitespace-pre-line">
									{check.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</>
	);
}
