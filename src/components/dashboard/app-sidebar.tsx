"use client";

import * as React from "react";
import {
	IconSettings,
	IconInfoCircle,
	IconMessageDots,
	IconDatabase,
	IconRocket,
	IconBook,
	IconBriefcase,
	IconUserSquare,
	IconMessageQuestion,
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
	useSidebar,
} from "@/components/ui/sidebar";

import { useQuery } from "@tanstack/react-query";
import { getProjectsByUser } from "@/lib/api-keycloak";
import { Link } from "@tanstack/react-router";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: string | undefined;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	const { data: projects = [], isLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: getProjectsByUser,
		enabled: !!user,
	});

	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	const data = {
		navPlatform: [
			{
				title: "About",
				url: "/about",
				icon: IconMessageQuestion,
			},
			{
				title: "Public Data",
				url: "/public-data",
				icon: IconDatabase,
			},
			{
				title: "Get Started",
				url: "/get-started",
				icon: IconRocket,
			},
			{
				title: "Resources",
				url: "/resources",
				icon: IconBook,
			},
		],

		navMain: [
			{
				title: "My Projects",
				url: "/projects",
				icon: IconBriefcase,
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
				title: String(user),
				url: "/",
				icon: IconUserSquare,
			},
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
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							tooltip="MetaTrack Home"
							className="group-data-[collapsible=icon]:!size-12 data-[slot=sidebar-menu-button]:!p-6"
							size={null}
						>
							<Link to="/">
								<img
									src={
										isCollapsed
											? "/Metatrack-logo.svg"
											: "/Metatrack_logo_advanced.svg"
									}
									alt="MetaTrack Logo"
									className={isCollapsed ? "w-auto" : "h-16 w-auto"}
								/>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={data.navPlatform} />

				<NavMain items={data.navMain} />

				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
		</Sidebar>
	);
}
