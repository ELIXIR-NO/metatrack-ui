import { useQuery } from "@tanstack/react-query";
import type { Assay, AssaySampleRow, Project, Sample } from "@/lib/types";
import { DataTable } from "./dataTable";
import { getSamplesInAssay, getSampleFiles } from "@/lib/api-keycloak";
import { AddSamplesToAssayDialog } from "./add-samples-assay";
import { DownloadTemplateButton } from "./download-template-button";
import { EditAssayDialog } from "./edit-assay-dialog";

interface AssayTableProps {
	assay: Assay;
	project?: Project;
}

export function AssayTable({ assay, project }: AssayTableProps) {
	const { data: rows = [] } = useQuery<AssaySampleRow[]>({
		queryKey: ["assaySamples", assay.id],
		queryFn: async () => {
			const samples: Sample[] =
				(await getSamplesInAssay(project?.id!, assay.id)) ?? [];

			const samplesWithFiles = await Promise.all(
				samples.map(async (sample) => {
					try {
						const files = await getSampleFiles(Number(project?.id), sample.id);

						return {
							...sample,
							files,
						};
					} catch {
						return {
							...sample,
							files: [],
						};
					}
				})
			);

			return samplesWithFiles.map<AssaySampleRow>((sample) => ({
				name: sample.name ?? "Unknown",
				studyAccession: assay.studyAccession,
				instrumentModel: assay.instrumentModel,
				libraryName: assay.libraryName,
				librarySource: assay.librarySource,
				libraryStrategy: assay.libraryStrategy,
				librarySelection: assay.librarySelection,
				libraryLayout: assay.libraryLayout,
				insertSize: assay.insertSize,
				createdOn: assay.createdOn,
				modifiedOn: assay.modifiedOn,
				files: sample.files,
			}));
		},
	});

	return (
		<DataTable
			data={rows}
			project={project}
			dataType="assay"
			onEdit={(sample) => console.log("Edit sample", sample)}
			onDelete={(sample) => console.log("Delete sample", sample)}
			showAddButton={
				<div className="flex gap-2">
					<EditAssayDialog assay={assay} projectId={project?.id!} />
					<DownloadTemplateButton type="assay" />
					<AddSamplesToAssayDialog
						projectId={project?.id!}
						assayId={assay.id}
					/>
				</div>
			}
		/>
	);
}
