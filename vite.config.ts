import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react(),
		babel({ presets: [reactCompilerPreset()] }),
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
				target: "https://auth.metatrack.no",
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/keycloak/, ""),
			},
			"/api": {
				target: "https://api.metatrack.no",
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/api/, "/api"),
			},
		},
	},
});
