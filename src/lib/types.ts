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
	// lastUpdatedOn is the API field name; modifiedOn is the display-facing alias returned by some endpoints
	lastUpdatedOn: string | null; // Date
	modifiedOn: string | null;
	files?: SampleFile[];
}

export interface SampleFile {
	name: string;
}

export type CreateSample = Omit<
	Sample,
	"id" | "createdOn" | "lastUpdatedOn" | "modifiedOn" | "files"
>;

export type MeResponse = {
	userId: string;
	username: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	isAuthenticated: boolean;
	roles: string[];
	avatar?: string;
};

export type Member = {
	memberId: string;
	role: string;
	email?: string | null;
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

export interface PresignDownloadRequest {
	projectId: number;
	sampleName: string;
	fileName: string;
}

export interface PresignUploadResponse {
	url: string;
	objectKey: string;
	expiresIn: number;
	expiresAt: string;
}

export type PresignDownloadResponse = PresignUploadResponse;

export interface Assay {
	id: string;
	name: string;
	studyAccession?: string | null;
	instrumentModel?: string | null;
	libraryName?: string | null;
	librarySource?: string | null;
	libraryStrategy?: string | null;
	librarySelection?: string | null;
	libraryLayout?: string | null;
	insertSize?: number | null;
	createdOn?: string | null;
	modifiedOn?: string | null;
	files?: SampleFile[];
}

export type AssaySampleRow = Omit<Assay, "id">;
