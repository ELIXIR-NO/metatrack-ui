import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		proxy: {
			"/keycloak": {
				target: "https://keycloak.elixir-uit.sigma2.no/",
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/keycloak/, ""),
			},
			"/api": {
				target: "https://api.elixir-uit.sigma2.no",
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/api/, "/api"),
			},
		},
	},
});
