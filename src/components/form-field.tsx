import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface FormFieldProps {
	label: string;
	required?: boolean;
	tooltip?: string;
	htmlFor?: string;
	children: ReactNode;
}

export function FormField({
	label,
	required,
	tooltip,
	htmlFor,
	children,
}: FormFieldProps) {
	return (
		<div className="space-y-1">
			<div className="flex items-center gap-1">
				<Label htmlFor={htmlFor} className="font-medium">
					{label}
					{required && <span className="ml-0.5 text-red-500">*</span>}
				</Label>

				{tooltip && (
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								className="text-muted-foreground hover:text-foreground"
							>
								<Info className="h-3 w-3" />
							</button>
						</TooltipTrigger>
						<TooltipContent className="text-sm">{tooltip}</TooltipContent>
					</Tooltip>
				)}
			</div>

			{children}
		</div>
	);
}
