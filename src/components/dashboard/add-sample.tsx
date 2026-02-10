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
import { CreateSample } from "@/lib/types";
import { createSample } from "@/lib/api-keycloak";
import { ChevronDown, ChevronUp, SquarePlus } from "lucide-react";
import { FormField } from "../form-field";

interface AddSampleDialogProps {
	projectId: string;
	studyId?: string;
	assayId?: string;
}

type FieldConfig = {
	key: keyof CreateSample;
	label: string;
	placeholder?: string;
	type?: string;
	numeric?: boolean;
	required?: boolean;
	tooltip?: string;
	advanced?: boolean;
};

const fields: FieldConfig[] = [
	{
		key: "name",
		label: "Sample Name",
		placeholder: "Sample name",
		required: true,
		tooltip: "Unique identifier for the sample within this project.",
	},
	{
		key: "alias",
		label: "Alias",
		placeholder: "Alias",
		tooltip:
			'Unique ID for identification of a sample in ENA. This should be the "TEXT_ID" OR "SAMPLE_NUMBER"',
	},
	{
		key: "taxId",
		label: "Tax ID",
		placeholder: "Tax ID",
		tooltip:
			"The Tax Id indicates the taxonomic classification(e.g. 9606 for human). ENA requires this information",
		numeric: true,
	},
	{
		key: "hostTaxId",
		label: "Host Tax ID",
		placeholder: "Host Tax ID",
		numeric: true,
		tooltip:
			"The Tax Id indicates the taxonomic classification of the host to the organism from which sample was obtained(e.g. 9606 for human).",
		advanced: true,
	},
	{
		key: "mlst",
		label: "MLST",
		placeholder: "MLST",
		tooltip: "",
		advanced: true,
	},
	{
		key: "isolationSource",
		label: "Isolation Source",
		placeholder: "Isolation Source",
		tooltip:
			"Describes the physical, environmental and/or local geographical source of the biological sample from which the sample was derived",
		advanced: true,
	},
	{
		key: "collectionDate",
		label: "Collection Date",
		placeholder: "Collection Date",
		type: "date",
		tooltip:
			"The date the sample was collected with the intention of sequencing. Full-date notation as defined by RFC 3339, section 5.6, for example, 2017-07-21",
		advanced: true,
	},
	{
		key: "location",
		label: "Location",
		placeholder: "Location",
		tooltip:
			"The geographical origin of the sample as defined by the specific region name followed by the locality name.",
		advanced: true,
	},
	{
		key: "sequencingLab",
		label: "Sequencing Lab",
		placeholder: "Sequencing Lab",
		tooltip: "",
		advanced: true,
	},
	{
		key: "institution",
		label: "Institution",
		placeholder: "Institution",
		tooltip: "",
		advanced: true,
	},
	{
		key: "hostHealthState",
		label: "Host Health State",
		placeholder: "Host Health State",
		tooltip: "Health status of the host at the time of sample collection.",
		advanced: true,
	},
];

function RenderField({
	field,
	value,
	onChange,
}: {
	field: FieldConfig;
	value: string;
	onChange: (value: string) => void;
}) {
	const input = (
		<Input
			type={field.type ?? "text"}
			placeholder={field.placeholder}
			value={value}
			required={field.required}
			onChange={(e) => {
				const val = e.target.value;
				if (field.numeric && !/^\d*$/.test(val)) return;
				onChange(val);
			}}
			inputMode={field.numeric ? "numeric" : undefined}
			pattern={field.numeric ? "[0-9]*" : undefined}
		/>
	);

	if (field.tooltip || field.required) {
		return (
			<FormField
				label={field.label}
				required={field.required}
				tooltip={field.tooltip}
			>
				{input}
			</FormField>
		);
	}

	return (
		<div>
			<label className="font-medium">{field.label}</label>
			{input}
		</div>
	);
}

export function AddSampleDialog({ projectId }: AddSampleDialogProps) {
	const [form, setForm] = useState({
		name: "",
		alias: "",
		taxId: "",
		hostTaxId: "",
		mlst: "",
		isolationSource: "",
		collectionDate: "",
		location: "",
		sequencingLab: "",
		institution: "",
		hostHealthState: "",
	});

	const updateField = (key: keyof typeof form, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const [showAdvanced, setShowAdvanced] = useState(false);

	const [open, setOpen] = useState(false);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (data: CreateSample) => createSample(data, projectId),

		onSuccess: () => {
			setOpen(false);

			toast.success("Sample has been created", {
				description: new Date().toLocaleString(),
			});

			queryClient.invalidateQueries({
				queryKey: ["samples", projectId],
			});
		},

		onError: (error: any) => {
			toast.error(error?.message ?? "Error creating sample");
		},
	});

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();

		mutation.mutate({
			...form,
			taxId: form.taxId === "" ? null : Number(form.taxId),
			hostTaxId: form.hostTaxId === "" ? null : Number(form.hostTaxId),
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

					{fields
						.filter((f) => !f.advanced)
						.map((field) => (
							<RenderField
								key={field.key}
								field={field}
								value={form[field.key] ?? ""}
								onChange={(value) => updateField(field.key, value)}
							/>
						))}

					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out ${showAdvanced ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} `}
					>
						<div className="space-y-4">
							{fields
								.filter((f) => f.advanced)
								.map((field) => (
									<RenderField
										key={field.key}
										field={field}
										value={form[field.key] ?? ""}
										onChange={(value) => updateField(field.key, value)}
									/>
								))}
						</div>
					</div>

					<Button
						type="button"
						variant="ghost"
						className="w-full justify-center gap-2 text-sm"
						onClick={() => setShowAdvanced((prev) => !prev)}
					>
						{showAdvanced ? (
							<>
								<ChevronUp className="h-4 w-4" />
								Hide additional fields
							</>
						) : (
							<>
								<ChevronDown className="h-4 w-4" />
								Show additional fields
							</>
						)}
					</Button>

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
