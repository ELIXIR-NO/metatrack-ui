import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CardGridData } from "./types";

export default function CardGrid({
	data,
	className = "",
}: {
	data: CardGridData[];
	className?: string;
}) {
	return (
		<div
			className={cn(
				"mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
				className
			)}
		>
			{data.map((item) => (
				<Card
					key={item.title}
					className="flex h-full flex-col transition-shadow duration-300 hover:shadow-2xl"
				>
					<a href={item.link} className="flex h-full flex-col">
						<CardHeader>
							<CardTitle className="text-left text-lg">{item.title}</CardTitle>
							<CardDescription></CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col items-center justify-center space-y-6">
							{typeof item.image === "string" ? (
								<img
									src={item.image}
									alt={item.title}
									width={500}
									height={250}
									className="aspect-video object-contain"
								/>
							) : (
								item.image
							)}
							<p className="text-justify text-sm">{item.description}</p>
						</CardContent>
					</a>
				</Card>
			))}
		</div>
	);
}
