import { SiteHeader } from "@/components/dashboard/site-header";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectsDataTable } from "@/components/dashboard/project-card";
import { useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { getProjectsByUser } from "@/lib/api-keycloak";
import { useState } from "react";
import { Project } from "@/lib/types";
import { EditProjectDialog } from "@/components/dashboard/edit-project-dialog";

export const Route = createFileRoute("/dashboard/projects/")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [open, setOpen] = useState(false);

	const { data: projects = [], isLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: getProjectsByUser,
	});

	const handleEdit = (project: Project) => {
		setEditingProject(project);
		setOpen(true);
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
				<div className="flex h-screen w-screen items-center justify-center gap-2">
					{" "}
					<Loader2Icon className="animate-spin" /> Loading projects...{" "}
				</div>
			) : (
				<div className="flex flex-col space-y-4 p-4">
					<ProjectsDataTable
						projects={projects}
						onOpen={handleOpen}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
					<EditProjectDialog
						project={editingProject}
						open={open}
						onOpenChange={setOpen}
					/>
				</div>
			)}
		</div>
	);
}
