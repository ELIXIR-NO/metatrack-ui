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
import {
	progressUploadFile,
	requestPresignedUpload,
} from "@/lib/api-keycloak";
import { Progress } from "../ui/progress";
import { Field, FieldLabel } from "../ui/field";

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
	const [, setProgress] = useState(0);

	const renderUploadToast = (fileName: string, progress: number) => (
		<Field className="w-xs">
			<FieldLabel>
				<span>Uploading {fileName}:</span>
				<span className="ml-auto">{progress}%</span>
			</FieldLabel>
			<Progress
				value={progress}
				className="h-3 rounded-md bg-gray-800 [&>div]:bg-green-500"
			/>
		</Field>
	);

	const uploadMutation = useMutation({
		mutationFn: async (file: File) => {
			const { url } = await requestPresignedUpload({
				projectId: Number(projectId),
				sampleName,
				file,
			});

			setOpen(false);

			const toastId = toast.loading(renderUploadToast(file.name, 0), {
				position: "bottom-right",
				icon: null,
			});

			await progressUploadFile(url, file, (p) => {
				setProgress(p);

				toast.loading(renderUploadToast(file.name, p), {
					id: toastId,
				});
			});

			toast.success("Upload completed", { id: toastId });
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
					<p className="text-muted-foreground text-xs">Any file type</p>

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
