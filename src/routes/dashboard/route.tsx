import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { SidebarSkeleton } from "@/components/sidebar-skeleton";
import { MeResponse } from "@/lib/types";
import { getMe } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayout,
});

export function useUser() {
	return useQuery<MeResponse>({
		queryKey: ["me"],
		queryFn: getMe,
	});
}

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
			<AppSidebar variant="inset" user={user.username ?? user.userId} />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
