"use client";

import * as React from "react";
import {
	IconSettings,
	IconBackpack,
	IconInfoCircle,
	IconMessageDots,
	IconUpload,
	IconDownload,
	IconSubtask,
	IconUserSquare,
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
import { useQuery } from "@tanstack/react-query";
import { getProjectsByUser } from "@/lib/api-keycloak";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: string | undefined;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	const { data: projects = [], isLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: getProjectsByUser,
		enabled: !!user,
	});

	const data = {
		navMain: [
			{
				title: "My Projects",
				url: "/projects",
				icon: IconBackpack,
				items: isLoading
					? [
							{
								title: "Loading...",
								url: "#",
							},
						]
					: projects.map((p: any) => ({
							title: p.name,
							url: `/dashboard/projects/${p.id}`,
						})),
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
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							tooltip="Home"
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="/dashboard">
								<IconUserSquare className="!size-6" />
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
