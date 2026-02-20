import Footer from "@/components/footer";
import { createRootRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "@/index.css";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { ThemeProvider } from "@/providers/theme-provider";
import { NavBarMobile } from "@/components/nav-bar/nav-bar-mobile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function RootLayout() {
	const matchRoute = useMatchRoute();

	const matchedLoginRoute = matchRoute({ to: "/dashboard", fuzzy: true });

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<div className="flex min-h-screen flex-col">
					{!matchedLoginRoute ? (
						<header>
							<div className="lg:hidden">
								<NavBarMobile />
							</div>
							<div className="hidden lg:flex">
								<NavBar />
							</div>
						</header>
					) : undefined}

					<main className="mx-auto w-full flex-1">
						<Outlet />
						<Toaster position="top-center" />
					</main>

					<Footer />
				</div>

				<TanStackRouterDevtools />
				<ReactQueryDevtools initialIsOpen={false} />
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
