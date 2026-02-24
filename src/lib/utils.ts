import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import "@tanstack/react-table";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const QUICK_EDIT_LIMIT = 4;
export const NON_EDITABLE_COLUMNS = [
	"name",
	"createdOn",
	"modifiedOn",
	"files",
];
export const NON_VIEWED_COLUMNS = ["id", "lastUpdatedOn"];

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends unknown, TValue> {
		label?: string;
	}
}

export function emptyToNull<T extends Record<string, any>>(obj: T): T {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [
			key,
			value === "" || value === undefined ? null : value,
		])
	) as T;
}
