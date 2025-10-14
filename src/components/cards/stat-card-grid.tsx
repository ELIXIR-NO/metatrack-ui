import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountingNumber } from "@/components/animate-ui/text/counting-number";
import type { StatCardData } from "./types";

export default function StatCardGrid({
	data,
	className = "",
}: {
	data: StatCardData[];
	className?: string;
}) {
	return (
		<div className="bg-secondary w-[75vw]">
			<div className="flex flex-col items-center rounded-md pb-4 text-center shadow-none">
				<div
					className={cn(
						"mt-6 grid w-full flex-1 grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3",
						className
					)}
				>
					{data.map((item, idx) =>
						item.type === "text" ? (
							<Card key={idx} className="flex h-full flex-col">
								<CardHeader className="items-center text-center">
									<CardTitle>{item.title}</CardTitle>
								</CardHeader>
								<CardContent className="flex flex-col justify-center gap-2 text-center">
									<div className="flex justify-center gap-3">
										{item.icon && <item.icon size={42} />}
										<CountingNumber
											number={item.numberText}
											className="text-5xl"
											inView={true}
										/>
									</div>
									{item.description}
								</CardContent>
							</Card>
						) : (
							<Card
								key={idx}
								className="flex flex-col items-center justify-center text-center"
							>
								<CardHeader>
									<CardTitle>{item.title}</CardTitle>
								</CardHeader>
								<CardContent className="flex flex-col justify-center gap-2 text-center">
									<div className="flex justify-center gap-3 text-4xl">
										{item.icon && <item.icon size={42} />}
										{item.type === "date"
											? (item.dateText ?? "No date")
											: "—"}{" "}
									</div>
									{item.description}
								</CardContent>
							</Card>
						)
					)}
				</div>
			</div>
		</div>
	);
}
