"use client";

import * as React from "react";
import {
	IconInnerShadowTop,
	IconSettings,
	IconBackpack,
	IconInfoCircle,
	IconMessageDots,
	IconUpload,
	IconDownload,
	IconSubtask,
} from "@tabler/icons-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: string | undefined;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	const data = {
		navMain: [
			{
				title: "My Projects",
				url: "/projects",
				icon: IconBackpack,
			},
		],
		navSecondary: [
			{
				title: "Settings",
				url: "#",
				icon: IconSettings,
			},
			{
				title: "Guide",
				url: "#",
				icon: IconInfoCircle,
			},
			{
				title: "Help and Support",
				url: "#",
				icon: IconMessageDots,
			},
		],
		documents: [
			{
				title: "Upload Data",
				url: "#",
				icon: IconUpload,
			},
			{
				title: "Download Data",
				url: "#",
				icon: IconDownload,
			},
			{
				title: "Pipelines",
				url: "#",
				icon: IconSubtask,
			},
		],
	};

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="/dashboard">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">{user}</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />

				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
		</Sidebar>
	);
}
