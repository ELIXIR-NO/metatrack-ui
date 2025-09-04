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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreHorizontal, X } from "lucide-react";
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
import { updateSample } from "@/lib/api-client";

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
											item={row.original}
											projectId={projectId} // ou passe via props da tabela
											studyId={studyId}
											assayId={assayId}
											onUpdated={() => {
												if (onEdit) onEdit(row.original); // callback externo
											}}
										/>
									)}
									{onDelete && (
										<Button
											variant="ghost"
											className="w-full px-0 text-left text-red-700"
										>
											Delete
										</Button>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						),
					}
				: undefined;

		return [
			selectionColumn,
			...autoColumns,
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
		try {
			await Promise.all(
				selectedRows.map(async (row: any) => {
					console.log("row:", row);
					const payload = {
						name: row.name, // mantém compatibilidade
						rawAttributes: row.rawAttributes.map((attr: any) =>
							attr.name === colName
								? { attributeName: attr.name, value }
								: { attributeName: attr.name, value: attr.value }
						),
					};

					console.log("payload:", payload);

					const updated = await updateSample(
						projectId,
						studyId,
						assayId,
						row.id,
						payload
					);

					if (onEdit) onEdit(updated as T);
				})
			);
		} catch (err) {
			console.error("Erro ao atualizar múltiplos samples:", err);
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
										<Button variant="ghost" size="sm">
											{String(col.header)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<form
											onSubmit={(e) => {
												e.preventDefault();
												const formData = new FormData(e.currentTarget);
												const value = formData.get("field") as string;
												handleBatchUpdate(String(col.header), value);
											}}
										>
											<Input
												name="field"
												placeholder={String(col.header)}
												className="w-auto"
											/>
										</form>
									</DropdownMenuContent>
								</DropdownMenu>
							</>
						))}

						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreHorizontal />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
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
													placeholder={String(col.header)}
													onChange={(e) => {
														const value = e.target.value;
														selectedRows.forEach((row) => {
															row[String(col.header) as keyof T] = value as any;
														});
													}}
													className="w-full"
												/>
											</PopoverContent>
										</Popover>
									</DropdownMenuItem>
								))}
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
							rows.map(
								(r: {
									map: (
										arg0: (v: any, i: string | number) => any[]
									) => Iterable<readonly [PropertyKey, any]>;
								}) =>
									Object.fromEntries(
										r.map((v: any, i: string | number) => [headers[i], v])
									)
							),
							"sample"
						)
					}
				>
					<Download />
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader className="bg-muted sticky top-0 z-10">
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
	item: any;
	projectId: string;
	studyId: string;
	assayId: string;
	onUpdated?: () => void; // callback pra atualizar a tabela
}) {
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData(e.currentTarget);
			const updateData: any = { rawAttributes: [] };

			updateData.name = item.name;

			// Verifica os rawAttributes alterados
			item.rawAttributes.forEach((attr: any) => {
				const newValue = formData.get(`rawAttributes.${attr.id}`) as string;

				updateData.rawAttributes.push({
					id: attr.id,
					attributeName: attr.name,
					value: newValue,
					units: attr.units ?? null,
				});
			});

			// Só faz a request se algo mudou
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
				if (onUpdated) onUpdated();
			} else {
				console.log("Nenhuma alteração detectada, nada para salvar.");
			}
		} catch (err) {
			console.error("Erro ao atualizar sample:", err);
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
					Edit
				</Button>
			</DrawerTrigger>
			<DrawerContent>
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
