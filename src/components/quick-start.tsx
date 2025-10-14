import { BookOpen, Fingerprint, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickStart() {
	return (
		<div className="mx-auto flex w-full max-w-[1200px] flex-wrap justify-center gap-[6vw]">
			{/* Card 1 */}
			<div className="flex flex-col items-center gap-6 rounded-xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md transition duration-300 hover:bg-white/20">
				<div className="flex flex-col items-center gap-4 transition-transform duration-300 hover:-translate-y-1 hover:scale-105">
					<BookOpen size={100} className="text-white" />
					<Button className="h-12 rounded-lg bg-white/20 px-6 text-white hover:bg-white/30">
						GET STARTED
					</Button>
				</div>
			</div>

			{/* Card 2 */}
			<div className="flex flex-col items-center gap-6 rounded-xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md transition duration-300 hover:bg-white/20">
				<div className="flex flex-col items-center gap-4 transition-transform duration-300 hover:-translate-y-1 hover:scale-105">
					<Upload size={110} className="text-white" />
					<Button className="h-12 rounded-lg bg-white/20 px-6 text-white hover:bg-white/30">
						UPLOAD DATA
					</Button>
				</div>
			</div>

			{/* Card 3 */}
			<div className="flex flex-col items-center gap-6 rounded-xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md transition duration-300 hover:bg-white/20">
				<div className="flex flex-col items-center gap-4 transition-transform duration-300 hover:-translate-y-1 hover:scale-105">
					<Fingerprint size={110} className="text-white" />
					<Button className="h-12 rounded-lg bg-white/20 px-6 text-white hover:bg-white/30">
						DATA ACCESS
					</Button>
				</div>
			</div>
		</div>
	);
}
