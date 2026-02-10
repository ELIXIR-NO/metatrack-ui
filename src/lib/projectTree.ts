import { Project, Sample } from "./types";

export function buildProjectTree(project: Project, samples: Sample[]) {
	return {
		name: project.name,
		children: samples.map((sample) => ({
			name: sample.name,
		})),
	};
}
