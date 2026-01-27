import { keycloak } from "./keycloak";
import { CreateSample, Project, Sample } from "./types";

const API_URL = "/api";

export async function api<T = unknown>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token = keycloak.token;

	const res = await fetch(`${API_URL}/${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
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

export async function createSample(
	data: CreateSample,
	projectId: string
): Promise<Sample> {
	return api(`projects/${projectId}/samples`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function batchEditSamples(
	projectId: string,
	data: {
		sampleData: {
			name?: string;
			alias?: string;
			taxId?: number;
			hostTaxId?: number;
			mlst?: string;
			isolationSource?: string;
			collectionDate?: string;
			location?: string;
			sequencingLab?: string;
			institution?: string;
			hostHealthState?: string;
		}[];
	}
) {
	return api(`projects/${projectId}/samples`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}
