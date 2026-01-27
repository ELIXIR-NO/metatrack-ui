import { useQuery } from "@tanstack/react-query";
import type { StatCardData } from "@/components/cards/types";
import { BsClipboard2Data } from "react-icons/bs";
import { RiDatabaseLine } from "react-icons/ri";
import { MdDateRange } from "react-icons/md";
import { getProjectsPublic } from "../api-keycloak";

export function useDashboardStats() {
	return useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: async (): Promise<StatCardData[]> => {
			const projects = await getProjectsPublic();

			return [
				{
					type: "text",
					title: "",
					numberText: 1994,
					description: "Samples",
					icon: BsClipboard2Data,
				},
				{
					type: "text",
					title: "",
					numberText: projects.length,
					description: "Projects",
					icon: RiDatabaseLine,
				},
				{
					type: "date",
					title: "",
					dateText: "01/14/2026",
					description: "Last submission date",
					icon: MdDateRange,
				},
			];
		},
	});
}
