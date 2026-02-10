"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { downloadSampleTemplate } from "@/lib/api-keycloak";

export function DownloadTemplateButton() {
	const [loading, setLoading] = useState(false);

	const handleDownload = async () => {
		try {
			setLoading(true);
			await downloadSampleTemplate();

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
			Download template
		</Button>
	);
}
