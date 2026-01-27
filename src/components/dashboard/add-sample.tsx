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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateSample, Sample } from "@/lib/types";
import { createSample } from "@/lib/api-keycloak";
import { SquarePlus } from "lucide-react";

interface AddSampleDialogProps {
	projectId: string;
	studyId?: string;
	assayId?: string;
}

export function AddSampleDialog({ projectId }: AddSampleDialogProps) {
	const [name, setName] = useState("");
	const [alias, setAlias] = useState("");
	const [taxId, setTaxId] = useState("");
	const [hostTaxId, setHostTaxId] = useState("");
	const [mlst, setMlst] = useState("");
	const [isolationSource, setIsolationSource] = useState("");
	const [collectionDate, setCollectionDate] = useState("");
	const [location, setLocation] = useState("");
	const [sequencingLab, setSequencingLab] = useState("");
	const [institution, setInstitution] = useState("");
	const [hostHealthState, setHostHealthState] = useState("");

	const [open, setOpen] = useState(false);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: CreateSample) => createSample(data, projectId),

		onSuccess: (newSample: Sample) => {
			queryClient.setQueryData<Sample[]>(["samples"], (old = []) => [
				newSample,
				...old,
			]);

			setOpen(false);

			const formattedDate = new Date().toLocaleString();

			toast.success("Sample has been created", {
				description: formattedDate,
			});

			queryClient.invalidateQueries({ queryKey: ["samples"] });
		},

		onError: (error: any) => {
			toast.error(error?.message ?? "Error creating sample");
		},
	});

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();

		mutation.mutate({
			name,
			alias,
			taxId: Number(taxId),
			hostTaxId: 1,
			mlst,
			isolationSource,
			collectionDate,
			location,
			sequencingLab,
			institution,
			hostHealthState,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2">
					<SquarePlus className="h-4 w-4" />
					Add Sample
				</Button>
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
							placeholder="Sample name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div>
						<label htmlFor="attrName" className="font-medium">
							Alias
						</label>
						<Input
							placeholder="Alias"
							value={alias}
							onChange={(e) => setAlias(e.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="attrValue" className="font-medium">
							Tax ID
						</label>
						<Input
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							placeholder="Tax ID"
							value={taxId}
							onChange={(e) => {
								const value = e.target.value;
								if (/^\d*$/.test(value)) {
									setTaxId(value);
								}
							}}
							required
						/>
					</div>

					<div>
						<label htmlFor="attrValue" className="font-medium">
							Host Tax ID
						</label>
						<Input
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							placeholder="Tax ID"
							value={hostTaxId}
							onChange={(e) => {
								const value = e.target.value;
								if (/^\d*$/.test(value)) {
									setHostTaxId(value);
								}
							}}
							required
						/>
					</div>

					<div>
						<label htmlFor="attrUnits" className="font-medium">
							MLST
						</label>
						<Input
							placeholder="MLST"
							value={mlst}
							onChange={(e) => setMlst(e.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="attrUnits" className="font-medium">
							Isolation Source
						</label>
						<Input
							placeholder="Isolation source"
							value={isolationSource}
							onChange={(e) => setIsolationSource(e.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="attrUnits" className="font-medium">
							Collection Date
						</label>
						<Input
							type="date"
							value={collectionDate}
							onChange={(e) => setCollectionDate(e.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="attrUnits" className="font-medium">
							Location
						</label>
						<Input
							placeholder="Geographical location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="attrUnits" className="font-medium">
							Sequence Lab
						</label>
						<Input
							placeholder="Sequencing lab"
							value={sequencingLab}
							onChange={(e) => setSequencingLab(e.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="attrUnits" className="font-medium">
							Institution
						</label>
						<Input
							placeholder="Institution"
							value={institution}
							onChange={(e) => setInstitution(e.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="attrUnits" className="font-medium">
							Host Health State
						</label>
						<Input
							placeholder="Host health state"
							value={hostHealthState}
							onChange={(e) => setHostHealthState(e.target.value)}
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
