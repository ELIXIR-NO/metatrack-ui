import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { HamburgerButton } from "../hamburger-button";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ModeToggle } from "../mode-toggle";
import { CircleHelp, Cloud, Info, LogOut, Search, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export function NavBarMobile() {
	const [open, setOpen] = useState(false);
	const { data: session } = authClient.useSession();
	const navigate = useNavigate();

	return (
		<nav className="flex flex-row justify-between px-4 py-3">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<HamburgerButton open={open} />
				</SheetTrigger>
				<SheetContent side="left" className="w-64">
					<SheetHeader>
						<SheetTitle className="font-bold">Menu</SheetTitle>
						<SheetDescription></SheetDescription>
					</SheetHeader>
					<div className="flex flex-col items-start space-y-6 px-4">
						<Link
							to="/about"
							className="flex items-center text-lg font-semibold hover:underline"
						>
							<Info className="mr-2" />
							About
						</Link>
						{session ? (
							<button
								onClick={() =>
									authClient.signOut({
										fetchOptions: {
											onSuccess: () => {
												navigate({ to: "/account/login" }); // redireciona após logout
											},
										},
									})
								}
								className="flex items-center text-lg font-semibold hover:underline"
							>
								<LogOut className="mr-2" />
								Sign Out
							</button>
						) : (
							<Link
								to="/account/login"
								className="flex items-center text-lg font-semibold hover:underline"
							>
								<User className="mr-2" />
								Register / Login
							</Link>
						)}
						<Link
							to="/"
							className="flex items-center text-lg font-semibold hover:underline"
						>
							<Search className="mr-2" />
							Browse Public Data
						</Link>
						<Link
							to="/"
							className="flex items-center text-lg font-semibold hover:underline"
						>
							GitHub
						</Link>
						<Link
							to="/"
							className="flex items-center text-lg font-semibold hover:underline"
						>
							<CircleHelp className="mr-2" />
							Support
						</Link>
						<Link
							to="/"
							className="flex items-center text-lg font-semibold hover:underline"
						>
							<Cloud className="mr-2" />
							API
						</Link>
					</div>
				</SheetContent>
			</Sheet>
			<div className="flex flex-col items-center">
				<Link to="/">
					<img
						src={"Metatrack_logo_advanced.svg"}
						alt={"MetaTrack Logo"}
						className="h-auto w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72"
					/>
				</Link>
			</div>
			<ModeToggle />
		</nav>
	);
}
