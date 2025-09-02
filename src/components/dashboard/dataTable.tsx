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

interface DataTableProps<T extends object> {
	data: T[];
	columns?: ColumnDef<T>[]; // opcional, pode gerar automaticamente
	onOpen?: (row: T) => void;
	onEdit?: (row: T) => void;
	onDelete?: (row: T) => void;
	showAddButton?: React.ReactNode;
	filterPlaceholder?: string;
}

export function DataTable<T extends object>({
	data,
	columns,
	onOpen,
	onEdit,
	onDelete,
	showAddButton,
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
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm">
										<MoreHorizontal size={16} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{onEdit && <TableCellViewer item={row.original} />}
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
										<Input
											placeholder={String(col.header)}
											onChange={(e) => {
												const value = e.target.value;
												selectedRows.forEach((row) => {
													row[String(col.header) as keyof T] = value as any;
												});
											}}
											className="w-auto"
										/>
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

function TableCellViewer({ item }: { item: any }) {
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
					<DrawerTitle className="text-xl">{item.name}</DrawerTitle>
				</DrawerHeader>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
					<form className="flex flex-col gap-4">
						<div className="flex flex-col gap-3">
							<Label htmlFor="header">Header</Label>
							<Input id="header" defaultValue="test" />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-3">
								<Label htmlFor="type">Type</Label>
								<Input id="header" defaultValue="test" />
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="status">Status</Label>
								<Input id="header" defaultValue="test" />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-3">
								<Label htmlFor="target">Target</Label>
								<Input id="header" defaultValue="test" />
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="limit">Limit</Label>
								<Input id="header" defaultValue="test" />
							</div>
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="reviewer">Reviewer</Label>
							<Input id="header" defaultValue="test" />
						</div>
					</form>
				</div>
				<DrawerFooter>
					<Button>Submit</Button>
					<DrawerClose asChild>
						<Button variant="outline">Done</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
