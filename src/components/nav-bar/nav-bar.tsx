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
import { useRouterState } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { HamburgerButton } from "../hamburger-button";
import { CircleHelp, Cloud, Search, User } from "lucide-react";

type NavItem = { pageUrl: string; pageName: string };
const NavItems: NavItem[] = [
	{
		pageUrl: "/about",
		pageName: "About",
	},
];

export function NavBar() {
	const [open, setOpen] = useState(false);

	return (
		<nav className="fixed top-10 right-0 left-0 z-10 h-fit py-2 backdrop-blur-sm">
			<div className="mx-auto flex w-full max-w-screen-2xl flex-row items-center justify-between pt-2">
				<div className="p-2">
					<a className="block text-6xl leading-none font-bold" href="/">
						MetaTrack GUI
					</a>
					<p className="text-muted-foreground text-2xl">By Elixir Norway</p>
				</div>

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
									<DropdownMenuItem>
										<User />
										Register / Login
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Search />
										Browse Public Data
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem>GitHub</DropdownMenuItem>
								<DropdownMenuItem>
									<CircleHelp />
									Support
								</DropdownMenuItem>
								<DropdownMenuItem disabled>
									<Cloud />
									API
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
	console.log("pageUrl:", pageUrl);
	console.log("pathName:", pathName);
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
