import { BookOpen, Fingerprint, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickStart() {
	return (
		<div className="flex w-full flex-col items-center gap-8 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-between">
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
	);
}
