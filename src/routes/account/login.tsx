import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { LogIn } from "lucide-react";
import { useState } from "react";
import { fetchUserInfo, login } from "@/lib/auth-client";
import { useAuth } from "@/providers/auth-provider";
import { User } from "@/lib/types";

export const Route = createFileRoute("/account/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const { setUser } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			const user: User = {
				password: password,
				username: email,
			};

			const data = await login(user);

			localStorage.setItem("access_token", data.access_token);
			localStorage.setItem("refresh_token", data.refresh_token);

			const userData = await fetchUserInfo();
			setUser(userData);

			await navigate({ to: "/dashboard" });
		} catch (err: any) {
			setError(err.message || "Login failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<div className="flex items-center justify-center gap-2">
						<CardTitle className="text-xl">Access MetaTrack Database</CardTitle>
						<LogIn />
					</div>
					<div className="flex items-center justify-center">
						<p className="inline-block text-sm">
							Don't have an account?{" "}
							<a
								href="/account/register"
								className="ml-auto inline-block text-sm underline underline-offset-4"
							>
								Sign up
							</a>
						</p>
					</div>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-6">
						{error && <p className="text-sm text-red-500">{error}</p>}

						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
								<a
									href="#"
									className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
								>
									Forgot your password?
								</a>
							</div>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "Logging in..." : "Login"}
						</Button>
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
