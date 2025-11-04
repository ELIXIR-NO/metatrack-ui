"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/dashboard/site-header";

import {
	getAssays,
	getInvestigationId,
	getSamples,
	getStudies,
} from "@/lib/api-client";
import { DataTable } from "@/components/dashboard/dataTable";
import { AddSampleDialog } from "@/components/dashboard/add-sample";
import { Assay, Project, Sample, Study } from "@/lib/types";
import { UploadSampleDialog } from "@/components/dashboard/upload-sample";
import { ColumnDef } from "@tanstack/react-table";

export const Route = createFileRoute("/dashboard/projects/$projectId")({
	component: RouteComponent,
});

export function RouteComponent() {
	const { projectId } = Route.useParams();

	const {
		data: project,
		isLoading: projectLoading,
		error: projectError,
	} = useQuery<Project>({
		queryKey: ["project", projectId],
		queryFn: () => getInvestigationId(projectId),
	});

	const { data: studies = [] } = useQuery<Study[]>({
		queryKey: ["studies", projectId],
		queryFn: () => getStudies(projectId),
		enabled: !!projectId,
	});

	const studyId = studies[0]?.id;

	const { data: assays = [] } = useQuery<Assay[]>({
		queryKey: ["assays", projectId, studyId],
		queryFn: () => getAssays(projectId, studyId),
		enabled: !!studyId,
	});

	const assayId = assays[0]?.id;

	const { data: samples = [], isLoading: samplesLoading } = useQuery<Sample[]>({
		queryKey: ["samples", projectId, studyId, assayId],
		queryFn: () => getSamples(projectId, studyId, assayId),
		enabled: !!assayId,
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
		samples.length > 0
			? [
					...samples[0].rawAttributes.map((attr: any) => ({
						accessorFn: (row: any) => {
							const found = row.rawAttributes.find(
								(a: any) => a.name === attr.name
							);
							return found?.value ?? "-";
						},
						id: attr.name,
						header: attr.name.charAt(0).toUpperCase() + attr.name.slice(1),
					})),
				]
			: [];

	return (
		<div>
			<SiteHeader
				items={[
					{ label: "My Projects", href: "/dashboard/projects" },
					{ label: project.title, href: `/dashboard/projects/${project.id}` },
				]}
			/>
			<div className="space-y-6 p-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-bold">
							{project.title}
						</CardTitle>
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
								studies={studies[0]}
								assays={assays[0]}
								showAddButton={
									studyId && assayId ? (
										<div className="flex gap-2">
											<AddSampleDialog
												projectId={projectId}
												studyId={studyId}
												assayId={assayId}
											/>
											<UploadSampleDialog
												projectId={projectId}
												studyId={studyId}
												assayId={assayId}
											/>
										</div>
									) : null
								}
							/>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
