import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Fingerprint, Upload } from "lucide-react";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="flex flex-col items-center">
			<div className="flex max-w-full flex-col gap-12 px-6">
				<div className="flex flex-col items-start justify-center">
					<h2 className="text-center lg:text-left">
						Open Platform for Metadata Management and Tracking
					</h2>
					<h4 className="text-center font-normal lg:text-left">
						For life scientists in Norway
					</h4>
				</div>

				<div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-between">
					<div className="flex flex-col items-center">
						<BookOpen size={150} />
						<Button className="mt-4 h-14 rounded-md px-6 has-[>svg]:px-4">
							GET STARTED
						</Button>
					</div>
					<div className="flex flex-col items-center">
						<Upload size={150} />
						<Button className="mt-4 h-14 rounded-md px-6 has-[>svg]:px-4">
							UPLOAD DATA
						</Button>
					</div>
					<div className="flex flex-col items-center">
						<Fingerprint size={150} />
						<Button className="mt-4 h-14 rounded-md px-6 has-[>svg]:px-4">
							DATA ACCESS
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
