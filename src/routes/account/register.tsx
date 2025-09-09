import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/auth-client";

export const Route = createFileRoute("/account/register")({
	component: RouteComponent,
});

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await register({
				username: email,
				email,
				firstName,
				lastName,
				password,
			});

			navigate({ to: "/account/login" });
		} catch (err: any) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="my-36 flex justify-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<div className="flex items-center justify-center gap-2">
						<CardTitle className="text-xl">
							Create your MetaTrack account
						</CardTitle>
					</div>
					<div className="flex items-center justify-center">
						<p className="inline-block text-sm">
							Already have an account?{" "}
							<a
								href="/account/login"
								className="ml-auto inline-block text-sm underline underline-offset-4"
							>
								Log in
							</a>
						</p>
					</div>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							{error && (
								<div className="text-center text-sm text-red-500">{error}</div>
							)}
							<div className="grid gap-2">
								<Label htmlFor="firstName">Fitst Name</Label>
								<Input
									id="firstName"
									type="text"
									placeholder="John"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									type="text"
									placeholder="Doe"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? "Registering..." : "Sign Up"}
							</Button>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex-col gap-2">
					<div className="text-muted-foreground flex w-full items-center gap-2 text-sm">
						<div className="bg-border h-px flex-1" />
						<span className="whitespace-nowrap">Or sign up with</span>
						<div className="bg-border h-px flex-1" />
					</div>
					<Button variant="outline" className="w-full">
						Continue with Feide
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
