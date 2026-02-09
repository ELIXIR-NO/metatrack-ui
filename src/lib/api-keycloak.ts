import { keycloak } from "./keycloak";
import {
	CreateSample,
	PresignUploadRequest,
	PresignUploadResponse,
	Project,
	StatisticsResponse,
} from "./types";
import { API_URL } from "./config";

//const API_URL = "/api";

export async function api<T = unknown>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = keycloak.token;

	const res = await fetch(`${API_URL}/${endpoint}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (!res.ok) {
		const contentType = res.headers.get("content-type");

		if (contentType?.includes("application/json")) {
			const data = await res.json();
			throw new Error(data?.message || data?.details || "API error");
		}

		const text = await res.text();
		throw new Error(text || "API error");
	}

	const contentType = res.headers.get("content-type");
	if (!contentType || !contentType.includes("application/json")) {
		return undefined as T;
	}

	return res.json();
}

export async function apiPublic<T = unknown>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const res = await fetch(`${API_URL}/${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (!res.ok) {
		let message = "API error";
		try {
			const data = await res.json();
			message = data?.message ?? message;
		} catch {
			message = await res.text();
		}
		throw new Error(message);
	}

	return res.json();
}

export function createInvestigation(data: Project) {
	return api<Project>("projects", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function getProjects() {
	return api<Project[]>("projects");
}

export async function getProjectsPublic() {
	return apiPublic<Project[]>("projects");
}

export async function getProjectsByUser() {
	return api<Project[]>("projects/me");
}

export async function createSample(
	data: CreateSample,
	projectId: string
): Promise<void> {
	await api(`projects/${projectId}/samples`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateSample(
	projectId: string,
	sampleId: string,
	data: Partial<CreateSample> // partial porque nem todos os campos precisam ser enviados
): Promise<void> {
	await api(`projects/${projectId}/samples/${sampleId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

// Atualizar várias samples de uma vez
export async function batchEditSamples(
	projectId: string,
	data: {
		sampleData: Partial<CreateSample>[]; // cada sample pode ter apenas os campos que você quer atualizar
	}
): Promise<void> {
	await api(`projects/${projectId}/samples`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function getStatistics() {
	return apiPublic<StatisticsResponse>("statistics");
}

export async function requestPresignedUpload(
	data: PresignUploadRequest
): Promise<PresignUploadResponse> {
	return api<PresignUploadResponse>("files/presign-upload", {
		method: "POST",
		body: JSON.stringify({
			projectId: data.projectId,
			sampleName: data.sampleName,
			fileName: data.file.name,
		}),
	});
}

export async function uploadFastaFile(
	uploadUrl: string,
	file: File
): Promise<void> {
	const res = await fetch(uploadUrl, {
		method: "PUT",
		body: file,
	});

	if (!res.ok) {
		throw new Error("Error uploading file to storage");
	}
}

export async function deleteProject(projectId: string): Promise<void> {
	const token = keycloak.token;
	const res = await fetch(`${API_URL}/projects/${projectId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || "Failed to delete project");
	}
}

//projects
export async function updateProject(
	projectId: string,
	data: { name?: string; description?: string }
) {
	return api(`projects/${projectId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function addProjectMember(
	projectId: string,
	memberId: string,
	role: string
) {
	return api(`projects/${projectId}/member/${memberId}`, {
		method: "POST",
		body: JSON.stringify({ role }),
	});
}

export async function updateProjectMember(
	projectId: string,
	memberId: string,
	role: string
) {
	return api(`projects/${projectId}/member/${memberId}`, {
		method: "PUT",
		body: JSON.stringify({ role }),
	});
}

export async function removeProjectMember(projectId: string, memberId: string) {
	return api(`projects/${projectId}/member/${memberId}`, {
		method: "DELETE",
	});
}

export async function deleteSelectedSamples<T extends { id: string }>(
	projectId: string,
	selectedRows: T[] | T
): Promise<{ success: string[]; failed: string[] }> {
	const token = keycloak.token;

	const sampleIds = Array.isArray(selectedRows)
		? selectedRows.map((row) => row.id)
		: [selectedRows.id];

	const results = await Promise.allSettled(
		sampleIds.map(async (sampleId) => {
			const res = await fetch(
				`${API_URL}/projects/${projectId}/samples/${sampleId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			return {
				id: sampleId,
				ok: res.ok,
			};
		})
	);

	const success: string[] = [];
	const failed: string[] = [];

	results.forEach((r) => {
		if (r.status === "fulfilled" && r.value.ok) {
			success.push(r.value.id);
		} else if (r.status === "fulfilled") {
			failed.push(r.value.id);
		} else {
			failed.push("unknown");
		}
	});

	return { success, failed };
}
