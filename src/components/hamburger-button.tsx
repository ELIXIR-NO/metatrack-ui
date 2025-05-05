import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type HamburgerButtonProps = React.ComponentPropsWithoutRef<"button"> & {
	asChild?: boolean;
	open?: boolean;
};

const HamburgerButton = React.forwardRef<
	HTMLButtonElement,
	HamburgerButtonProps
>(({ className, asChild = false, open = false, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			ref={ref}
			aria-label="Toggle menu"
			className={cn(
				"relative z-50 flex h-14 w-14 flex-col items-center justify-center gap-2",
				className
			)}
			{...props}
		>
			<span
				className={cn(
					"h-0.5 w-9 bg-current transition-transform duration-300 ease-in-out",
					open && "translate-y-2.5 rotate-45"
				)}
			/>
			<span
				className={cn(
					"h-0.5 w-9 bg-current transition-opacity duration-300 ease-in-out",
					open ? "opacity-0" : "opacity-100"
				)}
			/>
			<span
				className={cn(
					"h-0.5 w-9 bg-current transition-transform duration-300 ease-in-out",
					open && "-translate-y-2.5 -rotate-45"
				)}
			/>
		</Comp>
	);
});

HamburgerButton.displayName = "HamburgerButton";

export { HamburgerButton };
