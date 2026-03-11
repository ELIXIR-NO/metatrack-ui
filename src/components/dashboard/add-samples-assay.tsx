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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSamplesNew } from "@/lib/api-client";
import { addSamplesToAssay } from "@/lib/api-keycloak";

interface AddSamplesToAssayDialogProps {
	projectId: string;
	assayId: string;
}

export function AddSamplesToAssayDialog({
	projectId,
	assayId,
}: AddSamplesToAssayDialogProps) {
	const [open, setOpen] = useState(false);
	const [selectedSamples, setSelectedSamples] = useState<string[]>([]);

	const queryClient = useQueryClient();

	const { data: samples = [] } = useQuery({
		queryKey: ["samples", projectId],
		queryFn: () => getSamplesNew(projectId),
	});

	const { mutate, isPending } = useMutation({
		mutationFn: () => addSamplesToAssay(projectId, assayId, selectedSamples),
		onSuccess: () => {
			toast.success("Samples added to assay!");
			queryClient.invalidateQueries({ queryKey: ["assaySamples", assayId] });
			setOpen(false);
			setSelectedSamples([]);
		},
		onError: (err: any) => {
			toast.error(err?.message ?? "Failed to add samples");
		},
	});

	const toggleSample = (sampleName: string) => {
		setSelectedSamples((prev) =>
			prev.includes(sampleName)
				? prev.filter((s) => s !== sampleName)
				: [...prev, sampleName]
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm">Add Samples</Button>
			</DialogTrigger>

			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Select Samples to Add</DialogTitle>
				</DialogHeader>

				<div className="max-h-96 space-y-2 overflow-y-auto">
					{isPending ? (
						<p>Loading samples...</p>
					) : samples.length === 0 ? (
						<p>No samples available in this project</p>
					) : (
						samples.map((sample) => (
							<div key={sample.id} className="flex items-center gap-2">
								<Checkbox
									checked={selectedSamples.includes(sample.name)}
									onCheckedChange={() => toggleSample(sample.name)}
								/>
								<span>{sample.name}</span>
							</div>
						))
					)}
				</div>

				<DialogFooter className="flex justify-between">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>

					<Button
						onClick={() => mutate()}
						disabled={selectedSamples.length === 0 || isPending}
					>
						{isPending ? "Adding..." : "Add Selected Samples"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
