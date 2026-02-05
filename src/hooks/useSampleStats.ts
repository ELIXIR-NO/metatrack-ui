import { useQuery } from "@tanstack/react-query";

export type SampleStatPoint = {
	date: string;
	sample: number;
};

//mock data
function formatDate(date: Date) {
	return date.toISOString().split("T")[0];
}

export function generateSampleStats(days: number): SampleStatPoint[] {
	const today = new Date();

	return Array.from({ length: days }).map((_, index) => {
		const date = new Date(today);
		date.setDate(today.getDate() - (days - index));

		return {
			date: formatDate(date),
			sample: Math.floor(Math.random() * 40) + 5, // 5–45
		};
	});
}

function getDaysFromRange(range: string) {
	switch (range) {
		case "7d":
			return 7;
		case "30d":
			return 30;
		case "90d":
		default:
			return 90;
	}
}

async function mockFetchSampleStats(range: string): Promise<SampleStatPoint[]> {
	const days = getDaysFromRange(range);

	// simula delay de API real
	await new Promise((res) => setTimeout(res, 400));

	return generateSampleStats(days);
}

//async function getSampleStats(range: string): Promise<SampleStatPoint[]> {
//	const res = await fetch(
//		`https://api.metatrack.no/api/statistics/samples?range=${range}`
//	);
//
//	if (!res.ok) {
//		throw new Error("Failed to load sample statistics");
//	}
//
//	const data = await res.json();
//
//	return data.samplesOverTime.map((item: any) => ({
//		date: item.date,
//		sample: item.count,
//	}));
//}

export function useSampleStats(range: string) {
	return useQuery({
		queryKey: ["sample-stats", range],
		queryFn: () => mockFetchSampleStats(range),
		staleTime: 1000 * 60 * 5,
	});
}
