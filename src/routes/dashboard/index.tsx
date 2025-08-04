import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session } = authClient.useSession();
	console.log("session2:", session);

	if (!session) return <div>Not logged in</div>;

	return (
		<div>
			Welcome,{" "}
			{session && (
				<div>
					<p>{session.user.name}!</p>
					<p>email: {session.user.email}</p>
					<p>createdAt: {session.user.createdAt.toDateString()}</p>
				</div>
			)}
		</div>
	);
}
