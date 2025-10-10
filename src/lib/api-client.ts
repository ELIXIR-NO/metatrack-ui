import {
	Project,
	CreateProjectData,
	CreateStudyData,
	CreateAssayData,
	CreateSampleData,
	Study,
	Assay,
	Sample,
} from "./types";
import { API_URL } from "./config";

export async function createInvestigation(data: CreateProjectData) {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(`${API_URL}/api/v1/investigations`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		let errorMessage = "Failed to create project";

		try {
			const errorData: { message?: string } = await response.json();
			errorMessage = errorData.message || errorMessage;
		} catch {
			errorMessage = await response.text();
		}

		throw new Error(errorMessage);
	}

	return response.json();
}

export async function getInvestigations(): Promise<Project[]> {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(`${API_URL}/api/v1/investigations`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch investigations");
	}

	return response.json();
}

export async function getInvestigationsByUserId(): Promise<Project[]> {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(`${API_URL}/api/v1/me/investigations`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch investigations");
	}

	return response.json();
}

export async function getInvestigationId(projectId: string): Promise<Project> {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch investigation");
	}

	return response.json();
}

export async function createStudy(data: CreateStudyData, projectId: string) {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}/studies`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		let errorMessage = "Failed to create study";

		try {
			const errorData: { message?: string } = await response.json();
			errorMessage = errorData.message || errorMessage;
		} catch {
			errorMessage = await response.text();
		}

		throw new Error(errorMessage);
	}

	return response.json();
}

export async function createAssay(
	data: CreateAssayData,
	projectId: string,
	studyId: string
) {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}/studies/${studyId}/assays`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		let errorMessage = "Failed to create study";

		try {
			const errorData: { message?: string } = await response.json();
			errorMessage = errorData.message || errorMessage;
		} catch {
			errorMessage = await response.text();
		}

		throw new Error(errorMessage);
	}

	return response.json();
}

export async function createProjectWithStudyAndAssay(
	projectData: CreateProjectData
) {
	try {
		const project: Project = await createInvestigation(projectData);

		const studyData: CreateStudyData = {
			identifier: projectData.identifier,
			title: projectData.title,
			description: projectData.description,
			filename: projectData.filename,
		};
		console.log("createStudy(studyData, project.id):", studyData, project.id);
		const study = await createStudy(studyData, project.id);

		const assayData: CreateAssayData = {
			filename: projectData.filename,
		};
		console.log(
			"createAssay(assayData, project.id, study.id):",
			assayData,
			project.id,
			study.id
		);
		const assay = await createAssay(assayData, project.id, study.id);

		return { project, study, assay };
	} catch (error) {
		console.error("Failed to create project with study and assay:", error);
		throw error;
	}
}

export async function createSample(
	data: CreateSampleData,
	projectId: string,
	studyId: string,
	assayId: string
) {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}/studies/${studyId}/assays/${assayId}/samples`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		let errorMessage = "Failed to create sample";

		try {
			const errorData: { message?: string } = await response.json();
			errorMessage = errorData.message || errorMessage;
		} catch {
			errorMessage = await response.text();
		}

		throw new Error(errorMessage);
	}

	return response.json();
}

export async function getStudies(projectId: string): Promise<Study[]> {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}/studies`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch studies");
	}

	return response.json();
}

export async function getAssays(
	projectId: string,
	studyId: string
): Promise<Assay[]> {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}/studies/${studyId}/assays`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch assays");
	}

	return response.json();
}

export async function getSamples(
	projectId: string,
	studyId: string,
	assayId: string
): Promise<Sample[]> {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}/studies/${studyId}/assays/${assayId}/samples`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Erro ao buscar samples");
	}

	const data = await response.json();
	return data.samples ?? data;
}

export async function getSampleById(
	projectId: string,
	studyId: string,
	assayId: string,
	sampleId: string
) {
	const accessToken = localStorage.getItem("access_token");

	const res = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}/studies/${studyId}/assays/${assayId}/samples/id/${sampleId}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	if (!res.ok) throw new Error("Failed to fetch sample");

	return res.json();
}

export async function uploadSampleFile(
	investigationId: string,
	studyId: string,
	assayId: string,
	file: File
) {
	const formData = new FormData();
	formData.append("file", file);
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${investigationId}/studies/${studyId}/assays/${assayId}/samples/upload`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			body: formData,
		}
	);

	if (!response.ok) {
		throw new Error("Erro ao fazer upload do arquivo de amostras");
	}

	try {
		return await response.json();
	} catch {
		return { success: true };
	}
}

export async function updateSample(
	projectId: string,
	studyId: string,
	assayId: string,
	sampleId: string,
	data: CreateSampleData
): Promise<Sample | { success: true }> {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}/studies/${studyId}/assays/${assayId}/samples/id/${sampleId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		let errorMessage = "Failed to update sample";

		try {
			const errorData: { message?: string } = await response.json();
			errorMessage = errorData.message || errorMessage;
		} catch {
			errorMessage = await response.text();
		}

		throw new Error(errorMessage);
	}

	const text = await response.text();
	if (!text) {
		return { success: true };
	}

	try {
		return JSON.parse(text) as Sample;
	} catch {
		return { success: true };
	}
}

export async function batchEditSamples(
	projectId: string,
	studyId: string,
	assayId: string,
	data: {
		sampleData: {
			id: string;
			updateSampleRequest: {
				name?: string;
				rawAttributes?: {
					attributeName: string;
					value: string;
					unit?: string;
				}[];
			};
		}[];
	}
): Promise<{ success: true } | any> {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/v1/investigations/${projectId}/studies/${studyId}/assays/${assayId}/samples/batch-edit`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(data),
		}
	);

	if (!response.ok) {
		let errorMessage = "Failed to batch edit samples";

		try {
			const errorData: { message?: string } = await response.json();
			errorMessage = errorData.message || errorMessage;
		} catch {
			errorMessage = await response.text();
		}

		throw new Error(errorMessage);
	}

	const text = await response.text();
	if (!text) {
		return { success: true };
	}

	try {
		return JSON.parse(text);
	} catch {
		return { success: true };
	}
}

export async function deleteSelectedSamples<T extends { id: string }>(
	projectId: string,
	studyId: string,
	assayId: string,
	selectedRows: T[] | T
): Promise<{ success: string[]; failed: string[] }> {
	const accessToken = localStorage.getItem("access_token");

	const sampleIds = Array.isArray(selectedRows)
		? selectedRows.map((row) => row.id)
		: [selectedRows.id];

	const results = await Promise.allSettled(
		sampleIds.map((sampleId) =>
			fetch(
				`${API_URL}/api/v1/investigations/${projectId}/studies/${studyId}/assays/${assayId}/samples/id/${sampleId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			).then((res) => ({ id: sampleId, ok: res.ok }))
		)
	);

	const success: string[] = [];
	const failed: string[] = [];

	results.forEach((r) => {
		if (r.status === "fulfilled" && r.value.ok) {
			success.push(r.value.id);
		} else if (r.status === "fulfilled" && !r.value.ok) {
			failed.push(r.value.id);
		} else if (r.status === "rejected") {
			failed.push(r.reason?.id || "unknown");
		}
	});

	return { success, failed };
}
