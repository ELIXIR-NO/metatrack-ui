import { keycloak } from "./keycloak";
import { CreateSample, Project, Sample } from "./types";
import { API_URL } from "./config";

//const API_URL = "/api";

export async function createInvestigation(data: Project) {
	const token = keycloak.token;
	console.log("data:", data);

	const response = await fetch(`${API_URL}/projects`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
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

export async function getInvestigationsByUserId(): Promise<Project[]> {
	const token = keycloak.token;

	const response = await fetch(`${API_URL}/projects`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch investigations");
	}

	return response.json();
}

export async function getInvestigationId(projectId: string): Promise<Project> {
	const token = keycloak.token;

	console.log("token:", token);

	const response = await fetch(`${API_URL}/projects/${projectId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch investigation");
	}

	return response.json();
}

export async function getSamplesNew(projectId: string): Promise<Sample[]> {
	const token = keycloak.token;

	const response = await fetch(`${API_URL}/projects/${projectId}/samples`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Erro ao buscar samples");
	}

	const data = await response.json();
	return data.samples ?? data;
}

export async function uploadSampleFileNew(investigationId: string, file: File) {
	const formData = new FormData();
	formData.append("file", file);
	const token = keycloak.token;

	console.log("file:", file);
	console.log("formData:", formData);
	console.log("investigationId:", investigationId);

	const response = await fetch(
		`${API_URL}/projects/${investigationId}/samples/samplesheet`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		}
	);

	if (!response.ok) {
		const text = await response.text();
		console.error("Upload failed:", text);
		throw new Error("Error uploading sample file.");
	}

	try {
		return await response.json();
	} catch {
		return { success: true };
	}
}

export async function updateSample(
	projectId: string,
	sampleId: string,
	data: CreateSample
): Promise<Sample | { success: true }> {
	const accessToken = localStorage.getItem("access_token");

	const response = await fetch(
		`${API_URL}/api/projects/${projectId}/samples/${sampleId}`,
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
	sampleId: string,
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
		`${API_URL}/api/projects/${projectId}/samples/${sampleId}`,
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
	selectedRows: T[] | T
): Promise<{ success: string[]; failed: string[] }> {
	const accessToken = localStorage.getItem("access_token");

	const sampleIds = Array.isArray(selectedRows)
		? selectedRows.map((row) => row.id)
		: [selectedRows.id];

	const results = await Promise.allSettled(
		sampleIds.map((sampleId) =>
			fetch(`${API_URL}/api/projects/${projectId}/samples/${sampleId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}).then((res) => ({ id: sampleId, ok: res.ok }))
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
