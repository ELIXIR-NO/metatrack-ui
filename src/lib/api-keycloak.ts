import { keycloak } from "./keycloak";
import {
	Assay,
	CreateSample,
	Member,
	PresignDownloadRequest,
	PresignDownloadResponse,
	PresignUploadRequest,
	PresignUploadResponse,
	Project,
	Sample,
	SampleFile,
	StatisticsResponse,
} from "./types";
import { API_URL } from "./config";

export async function api<T = unknown>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = keycloak.token;

	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
		...((options.headers as Record<string, string>) || {}),
	};

	if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
		headers["Content-Type"] = "application/json";
	}

	const res = await fetch(`${API_URL}/${endpoint}`, {
		...options,
		headers,
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

export async function getSamples(projectId: string): Promise<Sample[]> {
	const data = await api<Sample[] | { samples: Sample[] }>(
		`projects/${projectId}/samples`
	);
	return Array.isArray(data) ? data : (data.samples ?? []);
}

export async function uploadSamplesheet(
	projectId: string,
	file: File
): Promise<unknown> {
	const formData = new FormData();
	formData.append("file", file);

	return api(`projects/${projectId}/samples/samplesheet`, {
		method: "POST",
		body: formData,
	});
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
	data: Partial<CreateSample>
): Promise<void> {
	await api(`projects/${projectId}/samples/${sampleId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function batchEditSamples(
	projectId: string,
	data: {
		sampleData: Partial<CreateSample>[];
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

export async function requestPresignedDownload(
	data: PresignDownloadRequest
): Promise<PresignDownloadResponse> {
	return api<PresignDownloadResponse>("files/presign-download", {
		method: "POST",
		body: JSON.stringify({
			projectId: data.projectId,
			sampleName: data.sampleName,
			fileName: data.fileName,
		}),
	});
}

export async function getSampleFiles(
	projectId: number,
	sampleId: string
): Promise<SampleFile[]> {
	return api<SampleFile[]>(`projects/${projectId}/samples/${sampleId}/files`, {
		method: "GET",
	});
}

export async function uploadFile(uploadUrl: string, file: File): Promise<void> {
	const res = await fetch(uploadUrl, {
		method: "PUT",
		body: file,
	});

	if (!res.ok) {
		throw new Error("Error uploading file to storage");
	}
}

export async function deleteProject(projectId: string): Promise<void> {
	await api(`projects/${projectId}`, {
		method: "DELETE",
	});
}

export async function updateProject(
	projectId: string,
	data: { name?: string; description?: string }
) {
	return api(`projects/${projectId}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function getAllProjectMembers(
	projectId: string
): Promise<Member[]> {
	return api<Member[]>(`projects/${projectId}/members`, {
		method: "GET",
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
	const sampleIds = Array.isArray(selectedRows)
		? selectedRows.map((row) => row.id)
		: [selectedRows.id];

	const results = await Promise.allSettled(
		sampleIds.map(async (sampleId) => {
			await api(`projects/${projectId}/samples/${sampleId}`, {
				method: "DELETE",
			});

			return {
				id: sampleId,
				ok: true,
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

export async function downloadSampleTemplate(): Promise<void> {
	const res = await fetch(`${API_URL}/templates/templateV1.csv`);

	if (!res.ok) {
		throw new Error("Failed to download template");
	}

	const blob = await res.blob();
	const url = window.URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "templateV1.csv";
	document.body.appendChild(a);
	a.click();

	a.remove();
	window.URL.revokeObjectURL(url);
}

export async function getAssays(projectId: string): Promise<Assay[]> {
	const data = await api<Assay[] | { assays: Assay[] }>(
		`projects/${projectId}/assays`
	);
	return Array.isArray(data) ? data : (data.assays ?? []);
}

export async function getAssayById(
	projectId: string,
	assayId: string
): Promise<Assay> {
	return api<Assay>(`projects/${projectId}/assays/${assayId}`);
}

export async function createAssay(
	projectId: string,
	payload: Partial<Assay>
): Promise<Assay> {
	return api<Assay>(`projects/${projectId}/assays`, {
		method: "POST",
		body: JSON.stringify({
			name: payload.name,
			studyAccession: payload.studyAccession ?? null,
			instrumentModel: payload.instrumentModel ?? null,
			libraryName: payload.libraryName ?? null,
			librarySource: payload.librarySource ?? null,
			libraryStrategy: payload.libraryStrategy ?? null,
			librarySelection: payload.librarySelection ?? null,
			libraryLayout: payload.libraryLayout ?? null,
			insertSize: payload.insertSize ?? null,
		}),
	});
}

export async function updateAssay(
	projectId: string,
	assayId: string,
	payload: Partial<Assay>
) {
	return api(`projects/${projectId}/assays/${assayId}`, {
		method: "PATCH",
		body: JSON.stringify(payload),
	});
}

export async function deleteAssay(projectId: string, assayId: string) {
	return api(`projects/${projectId}/assays/${assayId}`, {
		method: "DELETE",
	});
}

export async function getSamplesInAssay(
	projectId: string,
	assayId: string
): Promise<Sample[]> {
	return api<Sample[]>(`projects/${projectId}/assays/${assayId}/samples`);
}

export async function addSamplesToAssay(
	projectId: string,
	assayId: string,
	sampleNames: string[]
): Promise<void> {
	return api(`projects/${projectId}/assays/${assayId}/samples`, {
		method: "PUT",
		body: JSON.stringify({ sampleNames }),
	});
}

export async function progressUploadFile(
	url: string,
	file: File,
	onProgress?: (progress: number) => void
) {
	return new Promise<void>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("PUT", url);
		xhr.setRequestHeader(
			"Content-Type",
			file.type || "application/octet-stream"
		);

		if (onProgress) {
			xhr.upload.onprogress = (event) => {
				if (!event.lengthComputable) return;
				const percent = Math.round((event.loaded * 100) / event.total);
				onProgress(percent);
			};
		}

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve();
			} else {
				reject(new Error(`Upload failed with status ${xhr.status}`));
			}
		};
		xhr.onerror = () => reject(new Error("Upload failed"));
		xhr.send(file);
	});
}
