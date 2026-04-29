import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarSkeleton } from "@/components/sidebar-skeleton";
import { useUser } from "@/hooks/use-user";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const { data: user, isLoading } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !user) {
			navigate({ to: "/" });
		}
	}, [user, isLoading, navigate]);

	if (isLoading) {
		return (
			<SidebarProvider>
				<SidebarSkeleton />
			</SidebarProvider>
		);
	}

	if (!user) return null;

	return (
		<SidebarProvider className="min-h-full">
			<AppSidebar variant="inset" user={user} />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
