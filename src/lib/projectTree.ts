import { Assay, Project, Sample, Study } from "./types";

export function buildProjectTree(
	project: Project,
	studies: Study[],
	assays: Assay[],
	samples: Sample[]
) {
	return {
		name: project.title,
		children: studies.map((study) => ({
			name: study.title,
			children: assays
				//.filter((a) => a.filename === study.id)
				.map((assay) => ({
					name: assay.filename,
					children: samples
						.filter((s) => s.id !== assay.id)
						.map((sample) => ({ name: sample.name })),
				})),
		})),
	};
}
