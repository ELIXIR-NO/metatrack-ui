"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartData = [
	{ date: "2025-08-01", sample: 15 },
	{ date: "2025-08-02", sample: 18 },
	{ date: "2025-08-03", sample: 12 },
	{ date: "2025-08-04", sample: 26 },
	{ date: "2025-08-05", sample: 29 },
	{ date: "2025-08-06", sample: 34 },
	{ date: "2025-08-07", sample: 18 },
	{ date: "2025-08-08", sample: 32 },
	{ date: "2025-08-09", sample: 11 },
	{ date: "2025-08-10", sample: 19 },
	{ date: "2025-08-11", sample: 35 },
	{ date: "2025-08-12", sample: 21 },
	{ date: "2025-08-13", sample: 38 },
	{ date: "2025-08-14", sample: 22 },
	{ date: "2025-08-15", sample: 17 },
	{ date: "2025-08-16", sample: 19 },
	{ date: "2025-08-17", sample: 36 },
	{ date: "2025-08-18", sample: 41 },
	{ date: "2025-08-19", sample: 18 },
	{ date: "2025-08-20", sample: 15 },
	{ date: "2025-08-21", sample: 20 },
	{ date: "2025-08-22", sample: 17 },
	{ date: "2025-08-23", sample: 23 },
	{ date: "2025-08-24", sample: 29 },
	{ date: "2025-08-25", sample: 25 },
	{ date: "2025-08-26", sample: 13 },
	{ date: "2025-08-27", sample: 42 },
	{ date: "2025-08-28", sample: 18 },
	{ date: "2025-08-29", sample: 24 },
	{ date: "2025-08-30", sample: 38 },
	{ date: "2025-09-01", sample: 22 },
	{ date: "2025-09-02", sample: 31 },
	{ date: "2025-09-03", sample: 19 },
	{ date: "2025-09-04", sample: 42 },
	{ date: "2025-09-05", sample: 39 },
	{ date: "2025-09-06", sample: 52 },
	{ date: "2025-09-07", sample: 30 },
	{ date: "2025-09-08", sample: 21 },
	{ date: "2025-09-09", sample: 18 },
	{ date: "2025-09-10", sample: 33 },
	{ date: "2025-09-11", sample: 27 },
	{ date: "2025-09-12", sample: 24 },
	{ date: "2025-09-13", sample: 16 },
	{ date: "2025-09-14", sample: 49 },
	{ date: "2025-09-15", sample: 38 },
	{ date: "2025-09-16", sample: 40 },
	{ date: "2025-09-17", sample: 42 },
	{ date: "2025-09-18", sample: 35 },
	{ date: "2025-09-19", sample: 18 },
	{ date: "2025-09-20", sample: 23 },
	{ date: "2025-09-21", sample: 14 },
	{ date: "2025-09-22", sample: 12 },
	{ date: "2025-09-23", sample: 29 },
	{ date: "2025-09-24", sample: 22 },
	{ date: "2025-09-25", sample: 25 },
	{ date: "2025-09-26", sample: 17 },
	{ date: "2025-09-27", sample: 46 },
	{ date: "2025-09-28", sample: 19 },
	{ date: "2025-09-29", sample: 13 },
	{ date: "2025-09-30", sample: 28 },
	{ date: "2025-09-31", sample: 23 },
	{ date: "2025-10-01", sample: 20 },
	{ date: "2025-10-02", sample: 41 },
	{ date: "2025-10-03", sample: 16 },
	{ date: "2025-10-04", sample: 38 },
	{ date: "2025-10-05", sample: 14 },
	{ date: "2025-10-06", sample: 25 },
	{ date: "2025-10-07", sample: 37 },
	{ date: "2025-10-08", sample: 32 },
	{ date: "2025-10-09", sample: 48 },
	{ date: "2025-10-10", sample: 20 },
	{ date: "2025-10-11", sample: 15 },
	{ date: "2025-10-12", sample: 42 },
	{ date: "2025-10-13", sample: 13 },
	{ date: "2025-10-14", sample: 38 },
];

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	sample: {
		label: "Sample",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

export function ChartAreaHomePage() {
	const [timeRange, setTimeRange] = React.useState("90d");

	const filteredData = chartData.filter((item) => {
		const date = new Date(item.date);
		const referenceDate = new Date();
		let daysToSubtract = 90;
		if (timeRange === "30d") {
			daysToSubtract = 30;
		} else if (timeRange === "7d") {
			daysToSubtract = 7;
		}
		const startDate = new Date(referenceDate);
		startDate.setDate(startDate.getDate() - daysToSubtract);
		return date >= startDate;
	});

	return (
		<Card className="@container/card">
			<CardHeader>
				<CardTitle>Samples Uploaded</CardTitle>
				<CardDescription>
					<span className="hidden @[540px]/card:block">
						Total for the last 3 months
					</span>
					<span className="@[540px]/card:hidden">Last 3 months</span>
				</CardDescription>
				<CardAction>
					<ToggleGroup
						type="single"
						value={timeRange}
						onValueChange={setTimeRange}
						variant="outline"
						className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
					>
						<ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
						<ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
						<ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
					</ToggleGroup>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger
							className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
							aria-label="Select a value"
						>
							<SelectValue placeholder="Last 3 months" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="90d" className="rounded-lg">
								Last 3 months
							</SelectItem>
							<SelectItem value="30d" className="rounded-lg">
								Last 30 days
							</SelectItem>
							<SelectItem value="7d" className="rounded-lg">
								Last 7 days
							</SelectItem>
						</SelectContent>
					</Select>
				</CardAction>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={filteredData}>
						<defs>
							<linearGradient id="fillSample" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-sample)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-sample)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<YAxis />
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value: string | number | Date) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="sample"
							type="natural"
							fill="url(#fillSample)"
							stroke="var(--color-sample)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
