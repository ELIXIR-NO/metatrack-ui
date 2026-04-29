import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type RowData } from "@tanstack/react-table";

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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		label?: string;
	}
}

export function emptyToNull<T extends Record<string, unknown>>(obj: T): T {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [
			key,
			value === "" || value === undefined ? null : value,
		])
	) as T;
}
