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

export type IconType = React.ComponentType<{
	size?: number;
	className?: string;
}>;

export type StatCardData =
	| {
			type: "text";
			title: string;
			numberText: number;
			description: string;
			icon?: IconType;
	  }
	| {
			type: "date";
			title: string;
			dateText: string;
			description?: string;
			icon?: IconType;
	  };
