import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import "@tanstack/react-table";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const QUICK_EDIT_LIMIT = 3;
export const NON_EDITABLE_COLUMNS = ["alias"];
export const NON_VIEWED_COLUMNS = ["id", "createdOn", "lastUpdatedOn"];

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends unknown, TValue> {
		label?: string;
	}
}
