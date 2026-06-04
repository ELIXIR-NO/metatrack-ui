"use client";

import { type Icon } from "@tabler/icons-react";
import { ChevronRight, FileText, Flag } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

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
					{items.map((item) => {
						return (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={item.isActive}
								className="group/collapsible flex-none"
							>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										tooltip={item.title}
										isActive={location.pathname === `/projects${item.url}`}
										className="flex-none hover:bg-neutral-300"
									>
										<Link to={`${item.url}`}>
											{item.icon && <item.icon className="!size-6" />}
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>

									{item.items && item.items.length > 0 && (
										<CollapsibleTrigger asChild>
											<SidebarMenuAction className="-right-2 h-5 w-20 hover:bg-neutral-300">
												<ChevronRight className="group-data-[state=open]/collapsible:rotate-90" />
												<span className="sr-only">Arrow</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>
									)}

									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<Link
															to={subItem.url}
															className="flex items-center gap-2"
														>
															{item.isTeam ? (
																<Flag className="!size-4" />
															) : (
																<FileText className="!size-4" />
															)}
															<span>{subItem.title}</span>
														</Link>
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
