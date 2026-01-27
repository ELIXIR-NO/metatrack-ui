import { FC, useContext } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { AuthContext } from "@/providers/auth-context";

type NavItem = { pageUrl: string; pageName: string };
const NavItems: NavItem[] = [
	{
		pageUrl: "/about",
		pageName: "About",
	},
	{
		pageUrl: "/public-data",
		pageName: "Public Data",
	},
	{
		pageUrl: "/get-started",
		pageName: "Get Started",
	},
	{
		pageUrl: "/resources",
		pageName: "Resources",
	},
];

export function NavBar() {
	const { isAuthenticated, loading, login, logout } = useContext(AuthContext);

	return (
		<nav className="px-12 py-4">
			<div className="flex w-screen justify-around">
				<div>
					<Link to="/">
						<img
							src={"/Metatrack_logo_advanced.svg"}
							alt={"MetaTrack Logo"}
							width={250}
							height={65.55}
						/>
					</Link>
				</div>

				<div className="flex flex-row items-center gap-x-4 pb-4">
					<ul className="flex flex-row items-center gap-x-4">
						{!loading && !isAuthenticated ? null : (
							<Button
								variant="secondary"
								className={cn(
									"text-md",
									"h-10 rounded-md px-4 has-[>svg]:px-4"
								)}
							>
								<a href="/dashboard">Dashboard</a>
							</Button>
						)}
						{NavItems.map((it) => (
							<NavBarItem
								key={it.pageName}
								pageUrl={it.pageUrl}
								pageName={it.pageName}
							/>
						))}
						{!loading && !isAuthenticated ? (
							<Button
								onClick={() => {
									console.log("LOGIN CLICKED");
									login();
								}}
								className={cn(
									"text-md",
									"h-10 rounded-md px-4 has-[>svg]:px-4"
								)}
							>
								Login
							</Button>
						) : (
							<Button
								onClick={logout}
								variant="destructive"
								className={cn(
									"text-md",
									"h-10 rounded-md px-4 has-[>svg]:px-4"
								)}
							>
								Logout
							</Button>
						)}
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
			className={cn("text-md", "h-10 rounded-md px-4 has-[>svg]:px-4")}
			variant={pathName === pageUrl ? "default" : "secondary"}
		>
			<a href={pageUrl}>{pageName}</a>
		</Button>
	);
};
