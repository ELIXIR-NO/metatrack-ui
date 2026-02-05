"use client";

import { useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { HardDriveUpload } from "lucide-react";
import { requestPresignedUpload, uploadFastaFile } from "@/lib/api-keycloak";

interface UploadSampleDialogProps {
	projectId: string;
	sampleName: string;
	studyId?: string;
	assayId?: string;
}

export function UploadDataDialog({
	projectId,
	sampleName,
	studyId,
	assayId,
}: UploadSampleDialogProps) {
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const uploadMutation = useMutation({
		mutationFn: async (file: File) => {
			const { url } = await requestPresignedUpload({
				projectId: Number(projectId),
				sampleName,
				file,
			});

			await uploadFastaFile(url, file);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["samples", projectId, studyId, assayId],
			});

			toast.success("Upload completed successfully", {
				description: new Date().toLocaleString(),
			});

			setFile(null);
			setOpen(false);
		},
		onError: (error: any) => {
			toast.error(error?.message || "Upload failed");
		},
	});

	const handleUpload = () => {
		if (!file) return;
		uploadMutation.mutate(file);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const droppedFile = e.dataTransfer.files?.[0];
		if (droppedFile) setFile(droppedFile);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex w-full items-center gap-2" variant={"ghost"}>
					<HardDriveUpload />
					Upload Data
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Upload Data File</DialogTitle>
				</DialogHeader>

				{/* Dropzone */}
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					className="hover:bg-muted flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition"
				>
					<p className="text-muted-foreground text-sm">
						Drag & drop your file here
					</p>
					<p className="text-muted-foreground text-xs">FASTQ, FASTA</p>

					<Button
						variant="secondary"
						className="mt-3"
						onClick={() => fileInputRef.current?.click()}
					>
						Choose file
					</Button>

					<Input
						ref={fileInputRef}
						type="file"
						accept=".fastq,.fasta,.fastq.gz"
						className="hidden"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
					/>
				</div>

				{/* Nome do arquivo */}
				{file && (
					<p className="mt-2 text-sm">
						Selected file: <strong>{file.name}</strong>
					</p>
				)}

				{/* Ações */}
				<div className="mt-4 flex justify-end gap-2">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>

					<Button
						onClick={handleUpload}
						disabled={!file || uploadMutation.isPending}
					>
						{uploadMutation.isPending ? "Uploading..." : "Upload"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
