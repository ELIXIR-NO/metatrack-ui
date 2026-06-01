import { BadgeCheck, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import type { MeResponse } from "@/lib/types";
import { AuthContext } from "@/providers/auth-context";
import { useContext } from "react";
import { Link } from "@tanstack/react-router";

export function NavUser({ user }: { user: MeResponse }) {
	const { logout } = useContext(AuthContext);

	return (
		<div className="mt-auto">
			<Separator className="mb-4" />

			<div className="flex items-center gap-3 px-3 pb-4">
				<div className="min-w-0 flex-1">
					<p className="truncate font-medium">{user.username}</p>
					<p className="text-muted-foreground truncate text-xs">
						{user.username}
					</p>
				</div>
			</div>

			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild>
						<Link to="/projects/my-profile" className="flex items-center gap-2">
							<BadgeCheck className="size-4" />
							<span>Account</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>

				<SidebarMenuItem>
					<SidebarMenuButton
						onClick={logout}
						className="text-destructive hover:text-destructive"
					>
						<LogOut className="size-4" />
						<span>Log out</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</div>
	);
}
