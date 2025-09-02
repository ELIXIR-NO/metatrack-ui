import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardHome,
});

function DashboardHome() {
	return (
		<>
			<div className="flex min-h-svh flex-col items-center justify-center">
				Hello from Dashboard!
			</div>
		</>
	);
}
