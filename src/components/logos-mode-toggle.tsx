"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function LogosModeToggle() {
	const { resolvedTheme } = useTheme();
	let src;

	switch (resolvedTheme) {
		case "light":
			src = "/elixir-no-logo-black.svg";
			break;
		case "dark":
			src = "/elixir-no-logo-white.svg";
			break;
		default:
			src = "/elixir-no-logo-black.svg";
			break;
	}

	return (
		<img
			src={src}
			alt="Logo of ELIXIR Norway"
			width={150}
			height={50}
			className={cn("hover:ring-primary hover:ring-2")}
		/>
	);
}
