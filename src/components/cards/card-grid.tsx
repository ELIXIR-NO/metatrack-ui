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
	className = "w-full mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 px-4",
}: {
	data: CardGridData[];
	className?: string;
}) {
	return (
		<div className={cn("", className)}>
			{data.map((item, idx) => {
				let colClasses = "lg:col-span-2";

				if (data.length === 1) {
					colClasses = "lg:col-span-6";
				} else if (data.length === 2) {
					colClasses =
						idx === 0
							? "lg:col-span-3 lg:col-start-1"
							: "lg:col-span-3 lg:col-start-4";
				} else if (data.length === 3) {
					colClasses = "lg:col-span-2";
				}
				return (
					<Card
						key={item.title}
						className={cn(
							"bg-secondary flex h-full border-0 shadow-none",
							colClasses
						)}
					>
						<a href={item.link} className="flex h-full flex-col">
							<CardHeader>
								<CardTitle className="text-left text-lg">
									{item.title}
								</CardTitle>
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
				);
			})}
		</div>
	);
}
