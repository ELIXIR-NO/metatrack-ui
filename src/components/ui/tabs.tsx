"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";
import { useLocation, useNavigate } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsListVariants = cva(" inline-flex items-center justify-start h-9", {
	variants: {
		variant: {
			default: "rounded-lg bg-muted p-1",
			underline:
				"rounded-none bg-background gap-0 p-0 border-b border-gray-200",
		},
		size: {
			default: "h-9",
			sm: "h-8  text-xs",
			lg: "h-10 ",
			icon: "h-9 w-9",
		},
		width: {
			default: "w-full",
			fit: "w-fit",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
		width: "default",
	},
});

const TabsTriggerVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap text-sm font-normal  transition-all disabled:pointer-events-none data-[state=active]:text-foreground px-3",
	{
		variants: {
			variant: {
				default:
					"data-[state=active]:bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:shadow disabled:opacity-50 rounded-md py-1",
				underline:
					"bg-background border-b-2 border-secondary focus:border-primary ring-0 outline-none shadow-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary disabled:opacity-100 rounded-none m-0 pt-1.5 pb-2 hover:bg-background-muted data-[state=active]:font-semibold",
			},
			size: {
				default: "",
				sm: " text-xs",
				lg: "",
				icon: "h-9 w-9",
			},
			width: {
				default: "w-full",
				fit: "w-fit",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			width: "default",
		},
	}
);

export interface TabsListProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
		VariantProps<typeof TabsListVariants> {}

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	TabsListProps
>(({ className, variant, size, width, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			TabsListVariants({ variant, size, width }),
			variant === "underline" && "border-b border-gray-200",
			className
		)}
		{...props}
	/>
));
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
		VariantProps<typeof TabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	TabsTriggerProps
>(({ className, variant, size, width, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(TabsTriggerVariants({ variant, size, width, className }))}
		{...props}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			"ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
			className
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

interface TabsUrlSyncProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
	defaultValue: string;
	urlParamName?: string;
}

const TabsWithUrlSync: React.FC<TabsUrlSyncProps> = ({
	children,
	defaultValue,
	urlParamName = "tab",
	...props
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { searchStr } = useLocation();
	const searchParams = new URLSearchParams(searchStr);

	const [value, setValue] = React.useState(defaultValue);

	React.useEffect(() => {
		const tabFromUrl = searchParams.get(urlParamName);

		const isValidTab = React.Children.toArray(children).some((child) => {
			if (React.isValidElement<{ value?: string }>(child)) {
				return child.props.value === tabFromUrl;
			}
			return false;
		});

		if (tabFromUrl && isValidTab) {
			setValue(tabFromUrl);
		} else if (!tabFromUrl) {
			navigate({
				to: location.pathname,
				search: {
					...Object.fromEntries(searchParams.entries()),
					[urlParamName]: defaultValue,
				},
				replace: true,
			});
		}
	}, [
		searchParams,
		children,
		defaultValue,
		urlParamName,
		location.pathname,
		navigate,
	]);

	const handleValueChange = (newValue: string) => {
		setValue(newValue);

		navigate({
			to: location.pathname,
			search: {
				...Object.fromEntries(searchParams.entries()),
				[urlParamName]: newValue,
			},
			replace: true,
		});
	};

	return (
		<Tabs {...props} value={value} onValueChange={handleValueChange}>
			{children}
		</Tabs>
	);
};

export { TabsWithUrlSync, Tabs, TabsList, TabsTrigger, TabsContent };
