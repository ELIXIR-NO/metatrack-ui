import { useQuery } from "@tanstack/react-query";
import { getProjectsByUser, getSamples, getAssays } from "@/lib/api-keycloak";

export function useProject() {
	return useQuery({
		queryKey: ["project"],
		queryFn: async () => {
			const projects = await getProjectsByUser();

			const projectIds = projects.map((p) => p.id!).filter(Boolean);

			const [samplesArrays, assaysArrays] = await Promise.all([
				Promise.all(projectIds.map((id) => getSamples(id))),
				Promise.all(projectIds.map((id) => getAssays(id))),
			]);

			const samples = samplesArrays.flat();
			const assays = assaysArrays.flat();

			return {
				projects,
				samples,
				assays,
			};
		},
	});
}
