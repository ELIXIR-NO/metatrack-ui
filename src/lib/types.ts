// New types

export interface Sample {
	name: string;
	id: string;
	alias: string | null;
	taxId: number | null;
	hostTaxId: number | null;
	mlst: string | null;
	isolationSource: string | null;
	collectionDate: string | null; // Date
	location: string | null;
	sequencingLab: string | null;
	institution: string | null;
	hostHealthState: string | null;
	createdOn: string | null; // Date
	lastUpdatedOn: string | null; // Date
	modifiedOn: string | null;
}

export type CreateSample = Omit<
	Sample,
	"id" | "createdOn" | "lastUpdatedOn" | "modifiedOn"
>;

export type MeResponse = {
	userId: string;
	username: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	isAuthenticated: boolean;
	roles: string;
};

export interface Project {
	id?: string;
	name: string;
	description?: string;
}

export interface StatisticsResponse {
	projectCount: number;
	sampleCount: number;
	assayCount: number;
	lastUpdated: string;
}

export interface PresignUploadRequest {
	projectId: number;
	sampleName: string;
	file: File;
}

export interface PresignUploadResponse {
	url: string;
	objectKey: string;
	expiresIn: number;
	expiresAt: string;
}
