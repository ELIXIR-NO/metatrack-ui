import type { StatCardData } from "@/components/cards/types";
import { BsClipboard2Data } from "react-icons/bs";
import { RiDatabaseLine } from "react-icons/ri";
import { MdDateRange } from "react-icons/md";

export const statCards: StatCardData[] = [
	{
		type: "text",
		title: "",
		numberText: 1991,
		description: "Samples",
		icon: BsClipboard2Data,
	},
	{
		type: "text",
		title: "",
		numberText: 20,
		description: "Projects",
		icon: RiDatabaseLine,
	},
	{
		type: "date",
		title: "",
		dateText: "10/14/2025",
		description: "Last submission date",
		icon: MdDateRange,
	},
];
