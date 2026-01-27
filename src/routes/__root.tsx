import Footer from "@/components/footer";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "@/index.css";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { ThemeProvider } from "@/providers/theme-provider";
import { NavBarMobile } from "@/components/nav-bar/nav-bar-mobile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export const Route = createRootRoute({
	component: () => (
		<>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
					<header>
						<div className="lg:hidden">
							<NavBarMobile />
						</div>
						<div className="hidden lg:flex">
							<NavBar />
						</div>
					</header>
					<main className="mx-auto">
						<Outlet />
						<Toaster position="top-center" />
					</main>
					<Footer />
					<TanStackRouterDevtools />
					<ReactQueryDevtools initialIsOpen={false} />
				</ThemeProvider>
			</QueryClientProvider>
		</>
	),
});
