import { Assay, Project, Sample } from "./types";

export function buildProjectTree(project: Project, samples: Sample[]) {
	return {
		name: project.name,
		children: samples.map((sample) => ({
			name: sample.name,
		})),
	};
}

export function buildProjectTreeSampleAssay(
	project: Project,
	samples: Sample[],
	assay: Assay
) {
	return {
		name: project.name,
		children: samples.map((sample) => ({
			name: sample.name,
			id: sample.id,
			children: [
				{
					name: assay.name,
				},
			],
		})),
	};
}
