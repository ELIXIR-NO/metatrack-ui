import { FC, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { HamburgerButton } from "../hamburger-button";
import { CircleHelp, Cloud, LogOut, Search, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

type NavItem = { pageUrl: string; pageName: string };
const NavItems: NavItem[] = [
	{
		pageUrl: "/about",
		pageName: "About",
	},
];

export function NavBar() {
	const [open, setOpen] = useState(false);
	const { data: session } = authClient.useSession();
	const navigate = useNavigate();

	return (
		<nav className="fixed right-0 left-0 z-10 h-fit px-10 py-4 backdrop-blur-sm">
			<div className="mx-auto flex w-full max-w-screen-2xl flex-row items-center justify-between">
				<Link to="/">
					<img
						src={"Metatrack_logo_advanced.svg"}
						alt={"MetaTrack Logo"}
						width={250}
						height={65.55}
					/>
				</Link>

				<div className="flex flex-row items-center gap-x-4 pb-4">
					<ul className="flex flex-row items-center gap-x-4">
						{NavItems.map((it) => (
							<NavBarItem
								key={it.pageName}
								pageUrl={it.pageUrl}
								pageName={it.pageName}
							/>
						))}
						<DropdownMenu open={open} onOpenChange={setOpen}>
							<DropdownMenuTrigger asChild>
								<HamburgerButton open={open} />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-56">
								<DropdownMenuLabel>
									Exploring Public MetaTrack
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									{session ? (
										<DropdownMenuItem
											onClick={() =>
												authClient.signOut({
													fetchOptions: {
														onSuccess: () => {
															navigate({ to: "/" }); // redirect to login page
														},
													},
												})
											}
										>
											<LogOut />
											Sign Out
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem
											onClick={() => navigate({ to: "/account/login" })}
										>
											<User />
											Register / Login
										</DropdownMenuItem>
									)}

									<DropdownMenuItem>
										<Link to="/" className="flex items-center">
											<Search className="mr-2" />
											Browse Public Data
										</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Link to="/" className="flex items-center">
										GitHub
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link to="/" className="flex items-center">
										<CircleHelp className="mr-2" />
										Support
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem disabled>
									<Link to="/" className="flex items-center">
										<Cloud className="mr-2" />
										API
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</ul>
					<ModeToggle />
				</div>
			</div>
		</nav>
	);
}

const NavBarItem: FC<NavItem> = ({ pageUrl, pageName }) => {
	const selected = useRouterState({
		select: (state) => state.location,
	});
	const pathName = selected.pathname;
	return (
		<Button
			asChild
			className={cn(
				"text-lg",
				pathName === pageUrl && "text-secondary font-semibold",
				"h-14 rounded-md px-8 has-[>svg]:px-4"
			)}
		>
			<a href={pageUrl}>{pageName}</a>
		</Button>
	);
};
