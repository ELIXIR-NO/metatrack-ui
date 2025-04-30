import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<>
			<div className="flex min-h-svh flex-col items-center justify-center">
				Hello from About!
			</div>
		</>
	);
}
