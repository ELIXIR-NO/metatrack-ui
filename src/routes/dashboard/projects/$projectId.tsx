"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/dashboard/site-header";

import { getSamplesNew } from "@/lib/api-client";
import { DataTable } from "@/components/dashboard/dataTable";
import { AddSampleDialog } from "@/components/dashboard/add-sample";
import { Project, Sample } from "@/lib/types";
import { UploadSampleDialog } from "@/components/dashboard/upload-sample";
import { ColumnDef } from "@tanstack/react-table";
import { NON_VIEWED_COLUMNS } from "@/lib/utils";
import { getProjectsByUser } from "@/lib/api-keycloak";

export const Route = createFileRoute("/dashboard/projects/$projectId")({
	component: RouteComponent,
});

export function RouteComponent() {
	const { projectId } = Route.useParams();

	const {
		data: projects,
		isLoading: projectLoading,
		error: projectError,
	} = useQuery<Project[]>({
		queryKey: ["projects"],
		queryFn: () => getProjectsByUser(),
	});

	const project = projects?.find((p) => String(p.id) === projectId);

	const { data: samples = [], isLoading: samplesLoading } = useQuery<Sample[]>({
		queryKey: ["samples", projectId],
		queryFn: () => getSamplesNew(projectId),
		enabled: !!projectId,
	});

	if (projectLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>
		);
	}

	if (projectError) {
		return <div>Failed to load sample.</div>;
	}

	if (!project) {
		return <div>Sample not found</div>;
	}

	const dynamicColumns: ColumnDef<Sample>[] =
		samples.length > 0 && samples[0]
			? Object.keys(samples[0])
					.filter((key) => !NON_VIEWED_COLUMNS.includes(String(key)))
					.map((key) => ({
						accessorKey: key,
						header: key.charAt(0).toUpperCase() + key.slice(1),
					}))
			: [];

	return (
		<div>
			<SiteHeader
				items={[
					{ label: "My Projects", href: "/dashboard/projects" },
					{ label: project.name, href: `/dashboard/projects/${project.id}` },
				]}
			/>
			<div className="space-y-6 p-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground">{project.description}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Samples</CardTitle>
					</CardHeader>
					<CardContent>
						{samplesLoading ? (
							<Skeleton className="h-40 w-full" />
						) : (
							<DataTable
								data={samples}
								columns={dynamicColumns}
								onEdit={(sample) => console.log("Edit sample", sample)}
								onDelete={(sample) => console.log("Delete sample", sample)}
								project={project}
								showAddButton={
									<div className="flex gap-2">
										<AddSampleDialog projectId={projectId} />
										<UploadSampleDialog projectId={projectId} />
									</div>
								}
							/>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
