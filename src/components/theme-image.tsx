import { useTheme } from "@/providers/theme-provider";

interface ThemeImageProps {
	lightSrc: string;
	darkSrc: string;
	alt: string;
	className?: string;
}

export function ThemeImage({
	lightSrc,
	darkSrc,
	alt,
	className = "aspect-video object-contain",
}: ThemeImageProps) {
	const { theme } = useTheme();
	const src = theme === "light" ? darkSrc : lightSrc;

	return (
		<img src={src} alt={alt} width={550} height={500} className={className} />
	);
}
