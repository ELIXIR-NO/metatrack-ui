"use client";

import * as React from "react";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	flexRender,
	ColumnDef,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreHorizontal, SquarePen, X } from "lucide-react";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTablePagination } from "../data-table-pagination";
import { DataTableViewOptions } from "../data-table-column-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import downloadTSV from "@/lib/data/dataExport";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";
import { Label } from "../ui/label";
import { useState } from "react";
import { batchEditSamples, updateSample } from "@/lib/api-client";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteAlertButton } from "../delete-alert-button";
import { toast } from "sonner";
import { Sample } from "@/lib/types";

interface DataTableProps<T extends object> {
	data: T[];
	columns?: ColumnDef<T>[]; // opcional, pode gerar automaticamente
	onOpen?: (row: T) => void;
	onEdit?: (row: T) => void;
	onDelete?: (row: T) => void;
	showAddButton?: React.ReactNode;
	filterPlaceholder?: string;
	projectId: string;
	studyId: string;
	assayId: string;
}

export function DataTable<T extends object>({
	data,
	columns,
	onOpen,
	onEdit,
	onDelete,
	showAddButton,
	projectId,
	studyId,
	assayId,
	filterPlaceholder = "Filter...",
}: DataTableProps<T>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [initialColumnOrder, setInitialColumnOrder] = React.useState<string[]>(
		[]
	);
	const [, setLoading] = useState(false);
	const queryClient = useQueryClient();
	const now = new Date();
	const formattedDate = now.toLocaleString();

	const autoColumns: ColumnDef<T>[] = React.useMemo(() => {
		if (columns && columns.length > 0) return columns;

		if (data.length === 0) return [];

		return (Object.keys(data[0]) as Array<keyof T>).map((key) => ({
			accessorKey: key,
			header: (props) => (
				<DataTableColumnHeader
					column={props.column}
					title={String(key).charAt(0).toUpperCase() + String(key).slice(1)}
				/>
			),
		}));
	}, [columns, data]);

	const orderedColumns = React.useMemo(() => {
		if (autoColumns.length === 0) return [];

		if (initialColumnOrder.length === 0) {
			setInitialColumnOrder(
				autoColumns
					.map((col) => col.id)
					.filter((id): id is string => Boolean(id))
			);
			return autoColumns;
		}

		return initialColumnOrder
			.map((id) => autoColumns.find((col) => col.id === id))
			.filter(Boolean) as ColumnDef<T>[];
	}, [autoColumns, initialColumnOrder]);

	const enhancedColumns: ColumnDef<T>[] = React.useMemo(() => {
		const selectionColumn: ColumnDef<T> = {
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		};

		const actionColumn: ColumnDef<T> | undefined =
			onEdit || onDelete
				? {
						id: "actions",
						enableHiding: false,
						cell: ({ row }) => (
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm">
										<MoreHorizontal size={16} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{onEdit && (
										<TableCellViewer
											item={row.original as Sample}
											projectId={projectId}
											studyId={studyId}
											assayId={assayId}
											onUpdated={() => {
												if (onEdit) onEdit(row.original);
											}}
										/>
									)}
									{onDelete && (
										<DeleteAlertButton
											projectId={projectId}
											studyId={studyId}
											assayId={assayId}
											item={row.original as { id: string }[]}
											onDeleted={() => table.resetRowSelection()}
										/>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						),
					}
				: undefined;
		return [
			selectionColumn,
			...orderedColumns,
			...(actionColumn ? [actionColumn] : []),
		];
	}, [autoColumns, onOpen, onEdit, onDelete]);

	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({
			sample_alias: true,
			study_accession: true,
			instrument_model: true,
			library_strategy: true,
			library_layout: true,
			library_name: false,
			library_source: false,
			library_selection: false,
			insert_size: false,
			forward_file_name: false,
			reverse_file_name: false,
		});

	const table = useReactTable({
		data,
		columns: enhancedColumns,
		initialState: {
			pagination: { pageSize: 15 },
		},
		state: {
			sorting,
			globalFilter,
			columnVisibility,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableRowSelection: true,
		onColumnVisibilityChange: setColumnVisibility,
	});

	const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
	const prepareTableDataForDownload = (table: any) => {
		const headers = table
			.getHeaderGroups()[0]
			.headers.filter(
				(h: any, idx: number) =>
					!h.isPlaceholder &&
					idx > 0 &&
					idx < table.getHeaderGroups()[0].headers.length - 1
			)
			.map((h: any) => {
				const resolvedColumnDef = h.column.columnDef;
				if (resolvedColumnDef.accessorKey) return resolvedColumnDef.accessorKey;
				if (resolvedColumnDef.accessorFn) return resolvedColumnDef.id;
				return "";
			});

		const rows = table.getRowModel().rows.map((row: any) =>
			row
				.getVisibleCells()
				.slice(1, -1)
				.map((cell: any) => {
					const value = cell.getValue();
					return value !== undefined && value !== null ? String(value) : "";
				})
		);

		return { headers, rows };
	};

	const { headers, rows } = prepareTableDataForDownload(table);

	const handleBatchUpdate = async (colName: string, value: string) => {
		setLoading(true);

		try {
			const sampleData = selectedRows.map((row: any) => {
				console.log("row: ", row);
				const updateSampleRequest = {
					name: row.name,
					rawAttributes: row.rawAttributes.map((attr: any) =>
						attr.name === colName.toLowerCase()
							? { attributeName: attr.name, value, unit: attr.unit ?? "" }
							: {
									attributeName: attr.name,
									value: attr.value,
									unit: attr.unit ?? "",
								}
					),
				};

				return {
					id: row.id,
					updateSampleRequest,
				};
			});

			const updated = await batchEditSamples(projectId, studyId, assayId, {
				sampleData,
			});

			toast.success("Samples have been updated", {
				description: `${formattedDate}.`,
				action: {
					label: "Undo",
					onClick: () => console.log("Undo batch update"),
				},
			});

			queryClient.invalidateQueries({
				queryKey: ["samples", projectId, studyId, assayId],
			});

			if (onEdit) {
				if (updated?.samples) {
					updated.samples.forEach((s: T) => onEdit(s));
				} else {
					selectedRows.forEach((row: T) => onEdit(row));
				}
			}
		} catch (err: any) {
			console.error("Error to batch update samples:", err);
			const message = err?.message || "Error to batch update samples";

			toast.error(message, {
				action: {
					label: "Retry",
					onClick: () => handleBatchUpdate(colName, value),
				},
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="items-center justify-between space-x-2 lg:flex">
				<Input
					placeholder={filterPlaceholder}
					value={globalFilter ?? ""}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className="max-w-xs"
				/>

				{selectedRows.length > 0 && (
					<div className="inline-flex h-9 items-center rounded-md border">
						<div className="text-selected flex flex-1 flex-wrap items-center p-4 text-sm md:flex-row">
							{table.getFilteredSelectedRowModel().rows.length} selected
							<Button
								variant="ghost"
								size="sm"
								className="text-primary font-semibold"
								onClick={() => table.resetRowSelection()}
							>
								<X />
							</Button>
						</div>

						<Separator orientation="vertical" />
						{autoColumns.slice(0, 3).map((col) => (
							<>
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm" className="rounded-none">
											{String(col.header)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<form>
											<Input
												name="field"
												placeholder={String(col.header)}
												className="w-auto"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														const form = e.currentTarget.form;
														if (form) {
															const formData = new FormData(form);
															const value = formData.get("field") as string;
															handleBatchUpdate(String(col.header), value);
														}
													}
												}}
											/>
										</form>
									</DropdownMenuContent>
								</DropdownMenu>
								<Separator orientation="vertical" />
							</>
						))}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="rounded-none"
									onClick={() =>
										downloadTSV(
											selectedRows.map((r: any) =>
												Object.fromEntries(
													r
														.getVisibleCells()
														.map((cell: any, i: number) => [
															headers[i],
															cell.getValue(),
														])
												)
											),
											"selected-rows"
										)
									}
								>
									<Download className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Download selected</p>
							</TooltipContent>
						</Tooltip>

						<Separator orientation="vertical" />

						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="rounded-none">
									<MoreHorizontal />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel className="flex w-full flex-row items-center gap-2 px-6">
									<SquarePen size={18} />
									Edit selected
								</DropdownMenuLabel>

								<DropdownMenuSeparator />

								{autoColumns.slice(3).map((col) => (
									<DropdownMenuItem key={String(col.header)} asChild>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="ghost"
													className="flex flex-col justify-start"
												>
													{String(col.header)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="p-1">
												<Input
													name="field"
													placeholder={String(col.header)}
													className="w-auto"
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															const form = e.currentTarget.form;
															if (form) {
																const formData = new FormData(form);
																const value = formData.get("field") as string;
																handleBatchUpdate(String(col.header), value);
															}
														}
													}}
												/>
											</PopoverContent>
										</Popover>
									</DropdownMenuItem>
								))}

								{/* Separator */}
								<DropdownMenuSeparator />

								{/* Delete */}
								<DeleteAlertButton
									projectId={projectId}
									studyId={studyId}
									assayId={assayId}
									item={selectedRows as { id: string }[]}
									onDeleted={() => table.resetRowSelection()}
								/>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}

				<DataTableViewOptions table={table} />
				{showAddButton}
				<Button
					disabled={rows.length === 0}
					onClick={() =>
						downloadTSV(
							table
								.getFilteredRowModel()
								.rows.map((r: any) =>
									Object.fromEntries(
										r
											.getVisibleCells()
											.map((cell: any, i: number) => [
												headers[i],
												cell.getValue(),
											])
									)
								),
							"filtered-rows"
						)
					}
				>
					<Download className="h-4 w-4" />
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader className="bg-muted sticky top-0">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={enhancedColumns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<DataTablePagination table={table} />
		</div>
	);
}

function TableCellViewer({
	item,
	projectId,
	studyId,
	assayId,
	onUpdated,
}: {
	item: Sample;
	projectId: string;
	studyId: string;
	assayId: string;
	onUpdated?: () => void;
}) {
	const [loading, setLoading] = useState(false);

	const queryClient = useQueryClient();

	const now = new Date();
	const formattedDate = now.toLocaleString();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData(e.currentTarget);
			const updateData: any = { rawAttributes: [] };

			updateData.name = item.name;

			item.rawAttributes.forEach((attr: any) => {
				const newValue = formData.get(`rawAttributes.${attr.id}`) as string;

				updateData.rawAttributes.push({
					id: attr.id,
					attributeName: attr.name,
					value: newValue,
					units: attr.units ?? null,
				});
			});

			if (updateData.name || updateData.rawAttributes.length > 0) {
				console.log("Payload enviado:", {
					name: updateData.name,
					rawAttributes: updateData.rawAttributes,
				});
				console.log("Payload enviado:", {
					projectId: projectId,
					studyId: studyId,
					assayId: assayId,
					itemId: item.id,
				});
				await updateSample(projectId, studyId, assayId, item.id, updateData);

				toast.success("Sample has been updated", {
					description: `${formattedDate}.`,
					action: {
						label: "Undo",
						onClick: () => console.log("Undo"),
					},
				});

				queryClient.invalidateQueries({
					queryKey: ["samples", projectId, studyId, assayId],
				});

				if (onUpdated) onUpdated();
			} else {
				console.log("No changes detected, nothing to save.");
			}
		} catch (err: any) {
			console.error("Erro to updated sample:", err);
			const message = err?.message || "Erro to updated sample";

			toast.error(message, {
				action: {
					label: "Undo",
					onClick: () => console.log("Undo"),
				},
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Drawer direction="right">
			<DrawerTrigger asChild>
				<Button
					variant="ghost"
					className="text-foreground w-full px-0 text-left"
				>
					<SquarePen />
					Edit
				</Button>
			</DrawerTrigger>
			<DrawerContent aria-describedby={undefined}>
				<DrawerHeader className="gap-1">
					<DrawerTitle className="text-xl">Edit {item.name}</DrawerTitle>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto px-4">
					<form
						id="sampleForm"
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						{item.rawAttributes.map((attr: any) => (
							<div key={attr.id} className="flex flex-col gap-3">
								<Label htmlFor={attr.name}>{attr.name}</Label>
								<Input
									id={attr.name}
									name={`rawAttributes.${attr.id}`}
									defaultValue={attr.value}
								/>
							</div>
						))}
					</form>
				</div>

				<DrawerFooter>
					<Button form="sampleForm" type="submit">
						{loading ? "Saving..." : "Save"}
					</Button>
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
