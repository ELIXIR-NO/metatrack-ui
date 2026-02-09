// New types

export interface Sample {
	name: string;
	id: string;
	alias: string;
	taxId: number | null;
	hostTaxId: number | null;
	mlst: string;
	isolationSource: string;
	collectionDate: string; // Date
	location: string;
	sequencingLab: string;
	institution: string;
	hostHealthState: string;
	createdOn: string; // Date
	lastUpdatedOn: string; // Date
	modifiedOn: string;
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
