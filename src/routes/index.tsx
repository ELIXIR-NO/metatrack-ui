import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<>
			<div className="flex min-h-svh flex-col items-center justify-center">
				Hello from Home!
			</div>
		</>
	);
}
