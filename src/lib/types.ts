// New types

export interface Sample {
	name: string;
	id: string;
	alias: string;
	taxId: number;
	hostTaxId: number;
	mlst: string;
	isolationSource: string;
	collectionDate: string; // Date
	location: string;
	sequencingLab: string;
	institution: string;
	hostHealthState: string;
	createdOn: string; // Date
	lastUpdatedOn: string; // Date
}

export type CreateSample = Omit<Sample, "id" | "createdOn" | "lastUpdatedOn">;

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
