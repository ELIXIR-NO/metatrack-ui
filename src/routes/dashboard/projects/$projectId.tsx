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
import { DownloadTemplateButton } from "@/components/dashboard/download-template-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { getAssays } from "@/lib/api-keycloak";
import { Assay } from "@/lib/types";
import { AssayTable } from "@/components/dashboard/assayTable";
import { AddAssayDialog } from "@/components/dashboard/add-assay";

export const Route = createFileRoute("/dashboard/projects/$projectId")({
	component: RouteComponent,
});

export function RouteComponent() {
	const { projectId } = Route.useParams();
	const [activeTab, setActiveTab] = useState("samples");

	const {
		data: projects,
		isLoading: projectLoading,
		error: projectError,
	} = useQuery<Project[]>({
		queryKey: ["projects"],
		queryFn: () => getProjectsByUser(),
	});

	const project = projects?.find((p) => String(p.id) === projectId);

	const { data: samples = [] } = useQuery<Sample[]>({
		queryKey: ["samples", projectId],
		queryFn: () => getSamplesNew(projectId),
		enabled: !!projectId,
	});

	const { data: assays = [] } = useQuery<Assay[]>({
		queryKey: ["assays", projectId],
		queryFn: () => getAssays(projectId),
		enabled: !!projectId,
	});

	const [activeAssayTab, setActiveAssayTab] = useState<string | undefined>(
		assays.length > 0 ? assays[0].id : ""
	);

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

				<Card className="pt-2">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<CardHeader className="pb-0">
							<TabsList className="bg-transparent p-0">
								<TabsTrigger
									value="samples"
									variant="underline"
									className="text-lg font-semibold text-gray-500 data-[state=active]:border-blue-600"
								>
									Samples
								</TabsTrigger>

								<TabsTrigger
									value="runs"
									variant="default"
									className="text-lg font-semibold text-gray-500 data-[state=active]:border-blue-600"
								>
									Runs
								</TabsTrigger>
							</TabsList>
						</CardHeader>

						<CardContent className="pt-6">
							<TabsContent value="samples">
								<DataTable
									data={samples}
									columns={dynamicColumns}
									onEdit={(sample) => console.log("Edit sample", sample)}
									onDelete={(sample) => console.log("Delete sample", sample)}
									dataType="sample"
									project={project}
									showAddButton={
										<div className="flex gap-2">
											<DownloadTemplateButton />
											<AddSampleDialog projectId={projectId} />
											<UploadSampleDialog projectId={projectId} />
										</div>
									}
								/>
							</TabsContent>

							<TabsContent value="runs">
								{assays.length > 0 ? (
									<Tabs
										value={activeAssayTab}
										onValueChange={setActiveAssayTab}
									>
										<div className="mb-4 flex items-center gap-2">
											<TabsList>
												{assays.map((assay) => (
													<TabsTrigger key={assay.id} value={assay.id}>
														{assay.name}
													</TabsTrigger>
												))}
											</TabsList>

											<AddAssayDialog projectId={projectId}></AddAssayDialog>
										</div>

										{assays.map((assay) => (
											<TabsContent key={assay.id} value={assay.id}>
												<Card>
													<CardContent className="pt-6">
														<AssayTable assay={assay} project={project} />
													</CardContent>
												</Card>
											</TabsContent>
										))}
									</Tabs>
								) : (
									<div className="flex justify-center py-8">
										<AddAssayDialog projectId={projectId}></AddAssayDialog>
									</div>
								)}
							</TabsContent>
						</CardContent>
					</Tabs>
				</Card>
			</div>
		</div>
	);
}
