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
import { Spinner } from "../spinner";

interface UploadSampleDialogProps {
	projectId: string;
	sampleName: string;
}

export function UploadDataDialog({
	projectId,
	sampleName,
}: UploadSampleDialogProps) {
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const uploadMutation = useMutation({
		mutationFn: async (file: File) => {
			return toast.promise(
				async () => {
					const { url } = await requestPresignedUpload({
						projectId: Number(projectId),
						sampleName,
						file,
					});

					setOpen(false);

					await uploadFastaFile(url, file);

					return { completedAt: new Date() };
				},
				{
					loading: (
						<div className="flex items-center gap-2">
							<Spinner size={24} />
							<span>
								Uploading {file.name} to {sampleName}...
							</span>
						</div>
					),
					icon: null,
					position: "bottom-right",
					success: (data) => ({
						message: "Upload completed successfully",
						description: data.completedAt.toLocaleString(),
						position: "top-center",
					}),
					error: (error: any) => ({
						message: error?.message || "Upload failed",
						position: "top-center",
					}),
				}
			);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["samples", projectId],
			});

			setFile(null);
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
				<Button className="flex w-full gap-2 !px-2" variant={"ghost"}>
					<HardDriveUpload />
					Upload Data
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-2xl" aria-describedby={undefined}>
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
						accept=".fastq,.fasta,.gz"
						className="hidden"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
					/>
				</div>

				{file && (
					<p className="mt-2 text-sm">
						Selected file: <strong>{file.name}</strong>
					</p>
				)}

				<div className="mt-4 flex justify-end gap-2">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>

					<Button onClick={handleUpload}>Upload</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
