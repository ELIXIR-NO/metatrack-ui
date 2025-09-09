import { BookOpen, Fingerprint, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickStart() {
	return (
		<div className="flex w-[75vw] flex-col items-center gap-8 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-between">
			<div className="bg-secondary flex flex-col items-center gap-6 rounded-md p-6 shadow-lg">
				<div className="flex flex-col gap-2 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
					<BookOpen size={140} />

					<Button className="h-14 rounded-md px-6 has-[>svg]:px-4">
						GET STARTED
					</Button>
				</div>
				<h5 className="text-center font-medium">
					Learn how to navigate the platform
					<br />
					and start managing your metadata.
				</h5>
			</div>
			<div className="bg-secondary flex flex-col items-center gap-6 rounded-md p-6 shadow-lg">
				<div className="flex flex-col gap-2 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
					<Upload size={150} />
					<Button className="h-14 rounded-md px-6 has-[>svg]:px-4">
						UPLOAD DATA
					</Button>
				</div>
				<h5 className="text-center font-medium">
					Upload your experimental or
					<br />
					reference data directly to the system.
				</h5>
			</div>
			<div className="bg-secondary flex flex-col items-center gap-6 rounded-md p-6 shadow-lg">
				<div className="flex flex-col gap-2 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
					<Fingerprint size={150} />
					<Button className="h-14 rounded-md px-6 has-[>svg]:px-4">
						DATA ACCESS
					</Button>
				</div>
				<h5 className="text-center font-medium">
					Securely access your stored
					<br />
					data with advanced authentication.
				</h5>
			</div>
		</div>
	);
}
