import { useQuery } from "@tanstack/react-query";
import type { StatCardData } from "@/components/cards/types";
import { BsClipboard2Data } from "react-icons/bs";
import { RiDatabaseLine } from "react-icons/ri";
import { MdDateRange } from "react-icons/md";
import { getStatistics } from "../api-keycloak";

export function useDashboardStats() {
	return useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: async (): Promise<StatCardData[]> => {
			const stats = await getStatistics();

			return [
				{
					type: "text",
					title: "",
					numberText: stats.sampleCount,
					description: "Samples",
					icon: BsClipboard2Data,
				},
				{
					type: "text",
					title: "",
					numberText: stats.projectCount,
					description: "Projects",
					icon: RiDatabaseLine,
				},
				{
					type: "date",
					title: "",
					dateText: new Date(stats.lastUpdated).toLocaleDateString("en-US"),
					description: "Last submission date",
					icon: MdDateRange,
				},
			];
		},
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
}
