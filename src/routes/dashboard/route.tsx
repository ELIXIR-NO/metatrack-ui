import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { SidebarSkeleton } from "@/components/sidebar-skeleton";

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !user) {
			navigate({ to: "/" });
		}
	}, [user, loading, navigate]);

	if (loading)
		return (
			<SidebarProvider>
				<SidebarSkeleton></SidebarSkeleton>
			</SidebarProvider>
		);
	if (!user) return null;

	return (
		<SidebarProvider className="min-h-full">
			<AppSidebar variant="inset" user={user.firstName} />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
