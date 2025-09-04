export interface User {
	firstName?: string;
	lastName?: string;
	email?: string;
	username: string;
	password: string;
}

export interface Project {
	id: string;
	identifier: string;
	title: string;
	description?: string;
	createdAt: string;
	filename?: string;
}

export interface CreateProjectData {
	identifier: string;
	title: string;
	description: string;
	filename: string;
}

export interface CreateStudyData {
	identifier: string;
	title: string;
	description: string;
	filename: string;
}

export interface CreateAssayData {
	filename: string;
}

export interface RawAttribute {
	id: string;
	name: string;
	value: string;
	units: string;
}

export interface CreateSampleData {
	name: string;
	rawAttributes: RawAttribute[];
}

export interface Study {
	id: string;
	identifier: string;
	title: string;
	description?: string;
	filename?: string;
}

export interface Assay {
	id: string;
	filename: string;
}

export interface RawAttribute {
	id: string;
	name: string;
	value: string;
	units: string;
}

export interface TermSource {
	id: string;
	name: string;
	version: string;
	file: string;
	description: string;
	investigation?: any; // circular reference
	annotations?: any; // circular reference
}

export interface Unit {
	id: string;
	termSource: TermSource;
	termAccession: string;
	annotationValue: string;
}

export interface Category {
	id: string;
	characteristicType?: any; // circular reference
	study?: any; // circular reference
	factorName?: string;
	factorType?: any; // circular reference
}

export interface MaterialAttributeValue {
	id: string;
	category: Category;
	unit: Unit;
	value: string | null;
}

export interface FactorValue {
	id: string;
	category: Category;
	unit: Unit;
	value: string | null;
}

export interface SourceCharacteristic {
	id: string;
	category?: any;
	unit?: any;
	value: string | null;
}

export interface Source {
	id: string;
	name: string;
	characteristics: SourceCharacteristic[];
}

export interface Sample {
	id: string;
	name: string;
	rawAttributes: RawAttribute[];
	materialAttributeValues: MaterialAttributeValue[];
	factorValues: FactorValue[];
	sources: Source[];
}
