import { SiteHeader } from "@/components/dashboard/site-header";
import { getInvestigationsByUserId } from "@/lib/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectsDataTable } from "@/components/dashboard/project-card";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/projects/")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data: projects = [], isLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: getInvestigationsByUserId,
	});

	const handleEdit = (project: any) => {
		console.log("Edit", project);
	};

	const handleDelete = (project: any) => {
		queryClient.setQueryData(["projects"], (old: any[] = []) =>
			old.filter((p) => p.id !== project.id)
		);
	};

	const handleOpen = (project: any) => {
		navigate({ to: `/dashboard/projects/${project.id}` });
	};

	return (
		<div className="space-y-2">
			<SiteHeader
				items={[{ label: "My Projects", href: "/dashboard/projects" }]}
			/>

			{isLoading ? (
				<div>Loading projects...</div>
			) : (
				<div className="flex flex-col space-y-4 p-4">
					<ProjectsDataTable
						projects={projects}
						onOpen={handleOpen}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>
			)}
		</div>
	);
}
