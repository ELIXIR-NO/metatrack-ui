"use client";

import { IconReportAnalytics, type Icon } from "@tabler/icons-react";
import { ChevronRight, FileText, Flag } from "lucide-react";
import { useLocation } from "@tanstack/react-router";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
		isActive?: boolean;
		isTeam?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const location = useLocation();
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							tooltip="Overview"
							isActive={location.pathname === "/dashboard"}
							className={"min-w-8 gap-x-2 duration-200 ease-linear"}
						>
							<IconReportAnalytics className="!size-6" />
							<a href="/dashboard">
								<span>Overview</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map((item) => {
						return (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={item.isActive}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<div className="flex items-center justify-between">
										<SidebarMenuButton
											asChild
											tooltip="My Projects"
											isActive={location.pathname === `/dashboard${item.url}`}
											className="gap-x-2"
										>
											<a href={`/dashboard${item.url}`}>
												{item.icon && <item.icon className="!size-6" />}
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>

										{item.items && item.items.length > 0 && (
											<CollapsibleTrigger asChild>
												<SidebarMenuAction className="data-[state=open]:bg-accent rounded-sm">
													<ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
													<span className="sr-only">Arrow</span>
												</SidebarMenuAction>
											</CollapsibleTrigger>
										)}
									</div>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<a
															href={subItem.url}
															className="flex items-center gap-2"
														>
															{item.isTeam ? (
																<Flag className="!size-4" />
															) : (
																<FileText className="!size-4" />
															)}
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
