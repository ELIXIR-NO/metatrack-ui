import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@/hooks/use-user";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2Icon, User, Shield, Fingerprint } from "lucide-react";
import { SiteHeader } from "@/components/dashboard/site-header";

export const Route = createFileRoute("/projects/my-profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const { data: user, isLoading } = useUser();

	if (isLoading) {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<Loader2Icon className="size-12 animate-spin" />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div>
			<SiteHeader
				items={[{ label: "My Profile", href: "/projects/my-profile" }]}
			/>
			<div className="flex h-[80vh] items-center justify-center">
				<Card className="max-w-4xl">
					<CardHeader>
						<CardTitle className="text-2xl">My Profile</CardTitle>
						<CardDescription>
							Information associated with your MetaTrack account
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-8">
						<div className="grid gap-6 md:grid-cols-2">
							<Card>
								<CardContent className="flex items-center gap-4">
									<User className="text-primary size-8" />

									<div>
										<p className="text-muted-foreground text-sm">Username</p>
										<p className="font-semibold">{user.username}</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="flex items-center gap-4">
									<Fingerprint className="text-primary size-8" />

									<div>
										<p className="text-muted-foreground text-sm">User ID</p>
										<p className="font-mono text-sm break-all">{user.userId}</p>
									</div>
								</CardContent>
							</Card>
						</div>

						<div>
							<div className="mb-4 flex items-center gap-2">
								<Shield className="size-5" />
								<h3 className="text-lg font-semibold">Roles</h3>
							</div>

							<div className="flex flex-wrap gap-2">
								{user.roles?.length ? (
									user.roles.map((role) => (
										<Badge key={role} variant="secondary">
											{role}
										</Badge>
									))
								) : (
									<p className="text-muted-foreground">No roles assigned</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
