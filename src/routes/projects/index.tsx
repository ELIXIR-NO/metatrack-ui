import { SiteHeader } from "@/components/dashboard/site-header";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	keepPreviousData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { ProjectsDataTable } from "@/components/dashboard/project-card";
import { Loader2Icon } from "lucide-react";
import { getProjectsByUser } from "@/lib/api-keycloak";
import { useState } from "react";
import type { Project } from "@/lib/types";
import { EditProjectDialog } from "@/components/dashboard/edit-project-dialog";
import { SectionCards } from "#/components/dashboard/section-cards";

export const Route = createFileRoute("/projects/")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [open, setOpen] = useState(false);

	const {
		data: projects = [],
		isLoading,
		isFetching,
	} = useQuery({
		queryKey: ["projects"],
		queryFn: getProjectsByUser,

		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 30,

		refetchOnWindowFocus: false,

		placeholderData: keepPreviousData,
	});

	const handleEdit = (project: Project) => {
		setEditingProject(project);
		setOpen(true);
	};

	const handleDelete = (project: Project) => {
		queryClient.setQueryData(["projects"], (old: Project[] = []) =>
			old.filter((p) => p.id !== project.id)
		);
	};

	const handleOpen = (project: Project) => {
		navigate({ to: `/projects/${project.id}` });
	};

	if (isLoading) {
		return (
			<div className="flex h-screen w-screen items-center justify-center gap-2">
				<Loader2Icon className="animate-spin" />
				Loading projects...
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<SiteHeader
				items={[
					{
						label: "My Projects",
						href: "/projects",
					},
				]}
			/>

			{isFetching && (
				<div className="text-muted-foreground flex items-center gap-2 text-sm">
					<Loader2Icon className="size-4 animate-spin" />
					Refreshing...
				</div>
			)}

			<div className="@container/main gap-2 gap-4 py-4 md:gap-6 md:py-6">
				<SectionCards />
			</div>

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
		</div>
	);
}
