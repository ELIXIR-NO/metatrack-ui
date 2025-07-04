import type { StatCardData } from "@/components/cards/types";

export const statCards: StatCardData[] = [
	{
		type: "text",
		title: "CONTRIBUTORS",
		numberText: 300,
		description: "Data uploaders",
	},
	{
		type: "chart",
		title: "TYPE OF MICROBIAL SPECIES",
		unit: "species",
		data: [
			{ label: "Bacteria", value: 529, fill: "var(--chart-1)" },
			{ label: "Fungi", value: 197, fill: "var(--chart-2)" },
			{ label: "Archaea", value: 102, fill: "var(--chart-3)" },
			{ label: "Viruses", value: 65, fill: "var(--chart-4)" },
		],
	},
	{
		type: "chart",
		title: "TYPE OF PLATFORMS",
		unit: "Sequencing",
		data: [
			{ label: "PacBio", value: 40.8, fill: "var(--chart-1)" },
			{ label: "ONT", value: 59.2, fill: "var(--chart-2)" },
		],
	},
];
