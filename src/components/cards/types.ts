export type CardGridData = {
	title: string;
	description: string;
	image: string | React.ReactNode;
	link: string;
};

export type ChartItem = {
	label: string;
	value: number;
	fill?: string;
};

export type StatCardData =
	| {
			type: "text";
			title: string;
			numberText: number;
			description: string;
	  }
	| {
			type: "chart";
			title: string;
			description?: string;
			unit?: string;
			data: ChartItem[];
	  };
