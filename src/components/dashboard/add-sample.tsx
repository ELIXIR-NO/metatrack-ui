import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSample } from "@/lib/api-client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddSampleDialogProps {
	projectId: string;
	studyId: string;
	assayId: string;
}

export function AddSampleDialog({
	projectId,
	studyId,
	assayId,
}: AddSampleDialogProps) {
	const [name, setName] = useState("");
	const [attributeName, setAttributeName] = useState("");
	const [attributeValue, setAttributeValue] = useState("");
	const [attributeUnits, setAttributeUnits] = useState("");
	const [open, setOpen] = useState(false);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: { name: string; rawAttributes: any[] }) =>
			createSample(data, projectId, studyId, assayId),
		onSuccess: (newSample) => {
			queryClient.setQueryData(["samples"], (old: any[] = []) => [
				newSample,
				...old,
			]);

			setName("");
			setOpen(false);

			const now = new Date();
			const formattedDate = now.toLocaleString();

			toast.success("Sample has been created", {
				description: `${formattedDate}.`,
			});

			queryClient.invalidateQueries({ queryKey: ["samples"] });
		},
		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				error?.message ||
				"Error creating sample";

			toast.error(message);
		},
	});

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate({
			name,
			rawAttributes: [
				{
					id: crypto.randomUUID(),
					name: attributeName,
					value: attributeValue,
					units: attributeUnits,
				},
			],
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add Sample</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleCreate} className="space-y-4">
					<DialogHeader>
						<DialogTitle>Create New Sample</DialogTitle>
					</DialogHeader>

					{/* Sample Name */}
					<div>
						<label htmlFor="sampleName" className="font-medium">
							Sample Name
						</label>
						<Input
							id="sampleName"
							placeholder="Sample name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					{/* Attribute Name */}
					<div>
						<label htmlFor="attrName" className="font-medium">
							Attribute Name
						</label>
						<Input
							id="attrName"
							placeholder="e.g. Temperature"
							value={attributeName}
							onChange={(e) => setAttributeName(e.target.value)}
						/>
					</div>

					{/* Attribute Value */}
					<div>
						<label htmlFor="attrValue" className="font-medium">
							Attribute Value
						</label>
						<Input
							id="attrValue"
							placeholder="e.g. 37"
							value={attributeValue}
							onChange={(e) => setAttributeValue(e.target.value)}
						/>
					</div>

					{/* Attribute Units */}
					<div>
						<label htmlFor="attrUnits" className="font-medium">
							Attribute Units
						</label>
						<Input
							id="attrUnits"
							placeholder="e.g. C"
							value={attributeUnits}
							onChange={(e) => setAttributeUnits(e.target.value)}
						/>
					</div>

					<DialogFooter className="flex justify-between">
						<DialogClose asChild>
							<Button variant="outline" type="button">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? "Creating Sample..." : "Create Sample"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
