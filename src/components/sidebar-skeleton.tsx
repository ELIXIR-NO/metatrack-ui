"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarSkeleton() {
	return (
		<div className="flex h-screen w-full">
			{/* Sidebar Skeleton */}
			<Sidebar collapsible="offcanvas">
				{/* Header */}
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								className="data-[slot=sidebar-menu-button]:!p-1.5"
							>
								<div className="flex items-center gap-2">
									<Skeleton className="h-5 w-5 rounded-md" /> {/* Icon */}
									<Skeleton className="h-5 w-24" /> {/* Username */}
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				{/* Content */}
				<SidebarContent className="flex flex-col gap-6">
					{/* NavMain - My Projects */}
					<div className="flex flex-col gap-3">
						<Skeleton className="h-4 w-20" /> {/* Section title */}
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>

					{/* NavMain - My Team */}
					<div className="flex flex-col gap-3">
						<Skeleton className="h-4 w-20" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-4 w-28" />
						</div>
					</div>

					{/* Documents */}
					<div className="flex flex-col gap-3">
						<Skeleton className="h-4 w-24" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>

					{/* NavSecondary */}
					<div className="mt-auto flex flex-col gap-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-28" />
					</div>
				</SidebarContent>
			</Sidebar>

			{/* Main Content Skeleton */}
			<div className="flex flex-1 flex-col">
				{/* SiteHeader */}
				<div className="flex items-center justify-between border-b px-4 py-3 lg:px-6">
					<Skeleton className="h-6 w-32" />
					<div className="flex gap-2">
						<Skeleton className="h-8 w-20 rounded-md" />
						<Skeleton className="h-8 w-8 rounded-md" />
					</div>
				</div>

				{/* Body */}
				<div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
					{/* SectionCards */}
					<div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
						<Skeleton className="h-24 w-full rounded-xl" />
						<Skeleton className="h-24 w-full rounded-xl" />
						<Skeleton className="h-24 w-full rounded-xl" />
						<Skeleton className="h-24 w-full rounded-xl" />
					</div>

					{/* ChartAreaInteractive */}
					<div className="px-4 lg:px-6">
						<Skeleton className="h-[300px] w-full rounded-xl" />
					</div>

					{/* DataTable */}
					<div className="px-4 lg:px-6">
						<div className="flex flex-col gap-2">
							<Skeleton className="h-10 w-full rounded-md" />{" "}
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-12 w-full rounded-md" />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
