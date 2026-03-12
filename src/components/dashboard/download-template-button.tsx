"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { downloadSampleTemplate } from "@/lib/api-keycloak";

interface DownloadTemplateButtonProps {
	type: "sample" | "assay";
}

export function DownloadTemplateButton({ type }: DownloadTemplateButtonProps) {
	const [loading, setLoading] = useState(false);

	const handleDownload = async () => {
		try {
			setLoading(true);

			if (type === "sample") {
				await downloadSampleTemplate();
			} else if (type === "assay") {
				await downloadSampleTemplate(); // ADD ASSAY TEMPLATE HERE
			}

			toast.success("Template downloaded successfully");
		} catch (err: any) {
			toast.error(err?.message ?? "Error downloading template");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button variant="default" onClick={handleDownload} disabled={loading}>
			<Download className="h-4 w-4" />
			{type === "sample" ? "Sample" : "Assay"} Template
		</Button>
	);
}
