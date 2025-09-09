import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
} from "@/components/ui/chart";
import { PieChart, Pie, Label } from "recharts";
import { CountingNumber } from "@/components/animate-ui/text/counting-number";
import type { StatCardData, ChartItem } from "./types";
import { UsersRound } from "lucide-react";

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
				<div className="flex flex-col">
					<h3 className="text-primary pt-4 text-center font-semibold lg:text-left">
						Numbers Behind MetaTrack
					</h3>
				</div>
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
										<UsersRound size={48} />
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
							<Card key={idx} className="flex flex-col">
								<CardHeader className="items-center pb-0 text-center">
									<CardTitle>{item.title}</CardTitle>
									{item.description && (
										<CardDescription>
											<CardDescription>{item.description}</CardDescription>
										</CardDescription>
									)}
								</CardHeader>

								<CardContent className="flex-1 pb-0">
									<ChartContainer
										config={buildChartConfig(item.data)}
										className="mx-auto aspect-square h-auto w-full max-w-[300px] sm:max-w-[250px]"
									>
										<PieChart>
											<ChartTooltip
												cursor={false}
												content={
													<ChartTooltipContent hideLabel nameKey="label" />
												}
											/>
											<Pie
												data={item.data}
												dataKey="value"
												innerRadius={50}
												strokeWidth={5}
											>
												<Label
													content={({ viewBox }) => {
														const total = item.data.reduce(
															(sum, d) => sum + d.value,
															0
														);
														if (viewBox && "cx" in viewBox && "cy" in viewBox) {
															return (
																<text
																	x={viewBox.cx}
																	y={viewBox.cy}
																	textAnchor="middle"
																	dominantBaseline="middle"
																>
																	<tspan
																		x={viewBox.cx}
																		y={viewBox.cy}
																		className="fill-foreground text-3xl font-bold"
																	>
																		{total.toLocaleString()}
																	</tspan>
																	<tspan
																		x={viewBox.cx}
																		y={(viewBox.cy || 0) + 24}
																		className="fill-muted-foreground"
																	>
																		{item.unit ?? "Total"}
																	</tspan>
																</text>
															);
														}
													}}
												/>
											</Pie>
											<ChartLegend
												content={({ payload }) => (
													<div className="flex -translate-y-2 flex-wrap gap-2">
														{payload?.map((entry, idx) => {
															const data = entry.payload as
																| ChartItem
																| undefined;
															const total = item.data.reduce(
																(sum, d) => sum + d.value,
																0
															);

															if (!data) return null;

															return (
																<div
																	key={idx}
																	className="flex basis-1/4 items-center justify-center gap-2 text-xs"
																>
																	<span
																		className="h-3 w-3"
																		style={{ backgroundColor: entry.color }}
																	/>
																	<span>{data.label}</span>
																	<span className="text-muted-foreground">
																		({((data.value / total) * 100).toFixed(2)}%)
																	</span>
																</div>
															);
														})}
													</div>
												)}
											/>
										</PieChart>
									</ChartContainer>
								</CardContent>
								<CardFooter className="flex-col gap-2 text-sm">
									<div className="flex items-center gap-2 leading-none font-medium">
										Some text
									</div>
									<div className="text-muted-foreground leading-none">
										Some textSome textSome textSome text
									</div>
								</CardFooter>
							</Card>
						)
					)}
				</div>
			</div>
		</div>
	);
}

function buildChartConfig(data: ChartItem[]): ChartConfig {
	const config: ChartConfig = {
		label: { label: "Label" },
	};
	for (const item of data) {
		config[item.label] = {
			label: item.label,
			color: item.fill ?? "hsl(var(--chart-1))",
		};
	}
	return config;
}
