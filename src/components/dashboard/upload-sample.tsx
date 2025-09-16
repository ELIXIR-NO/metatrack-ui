"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadSampleFile } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface UploadSampleDialogProps {
	projectId: string;
	studyId: string;
	assayId: string;
}

export function UploadSampleDialog({
	projectId,
	studyId,
	assayId,
}: UploadSampleDialogProps) {
	const [file, setFile] = useState<File | null>(null);
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const uploadMutation = useMutation({
		mutationFn: (file: File) =>
			uploadSampleFile(projectId, studyId, assayId, file),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["samples", projectId, studyId, assayId],
			});

			const now = new Date();
			const formattedDate = now.toLocaleString();

			toast.success("Upload completed successfully", {
				description: `${formattedDate}.`,
				action: {
					label: "Undo",
					onClick: () => console.log("Undo"),
				},
			});
			setFile(null);
			setOpen(false);
		},
		onError: (error: any) => {
			console.error(error);
			const message =
				error?.response?.data?.message || error?.message || "Uploading error";

			toast.error(message, {
				action: {
					label: "Undo",
					onClick: () => console.log("Undo"),
				},
			});
		},
	});

	const handleUpload = () => {
		if (!file) return;
		uploadMutation.mutate(file);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Upload Sample</Button>
			</DialogTrigger>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Upload Sample File</DialogTitle>
				</DialogHeader>
				<Input
					type="file"
					accept=".csv,.xlsx,.tsv,.txt"
					onChange={(e) => setFile(e.target.files?.[0] || null)}
					className="my-4"
				/>
				<Button
					onClick={handleUpload}
					disabled={!file || uploadMutation.isPending}
				>
					{uploadMutation.isPending ? "Uploading..." : "Upload"}
				</Button>
			</DialogContent>
		</Dialog>
	);
}
