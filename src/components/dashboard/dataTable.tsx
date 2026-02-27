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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteAlertButton } from "../delete-alert-button";
import { toast } from "sonner";
import { CreateSample, Project, Sample } from "@/lib/types";
import {
	emptyToNull,
	NON_EDITABLE_COLUMNS,
	NON_VIEWED_COLUMNS,
	QUICK_EDIT_LIMIT,
} from "@/lib/utils";
import { ProjectTree } from "../projectTree";
import { buildProjectTree } from "@/lib/projectTree";
import { UploadDataDialog } from "./upload-data";
import {
	batchEditSamples,
	requestPresignedDownload,
	updateSample,
} from "@/lib/api-keycloak";

interface DataTableProps<T extends object> {
	data: T[];
	columns?: ColumnDef<T>[];
	onSelectSamples?: (selected: Sample[]) => void;
	onOpen?: (row: T) => void;
	onEdit?: (row: T) => void;
	onDelete?: (row: T) => void;
	showAddButton?: React.ReactNode;
	filterPlaceholder?: string;
	project?: Project;
}

const COLUMN_TOOLTIPS: Record<string, string> = {
	name: "Unique identifier for the sample within this project.",
	alias:
		'Unique ID for identification of a sample in ENA. This should be the "TEXT_ID" OR "SAMPLE_NUMBER"',
	taxId:
		"The Tax Id indicates the taxonomic classification(e.g. 9606 for human). ENA requires this information.",
	hostTaxId:
		"The Tax Id indicates the taxonomic classification of the host to the organism from which sample was obtained(e.g. 9606 for human).",
	mlst: "Multi-Locus Sequence Typing (MLST) scheme assigned to the isolate.",
	isolationSource:
		"Describes the physical, environmental and/or local geographical source of the biological sample from which the sample was derived.",
	collectionDate:
		"The date the sample was collected with the intention of sequencing. Full-date notation as defined by RFC 3339, section 5.6, for example, 2017-07-21.",
	location:
		"The geographical origin of the sample as defined by the specific region name followed by the locality name.",
	sequencingLab:
		"Typically the laboratory that carried out the sequencing of the samples.",
	institution:
		"Typically the institution or organization responsible for the project and its data.",
	hostHealthState:
		"Health status of the host at the time of sample collection.",
	createdOn: "Date of creation",
	modifiedOn: "Last modification date",
	files: "FASTQ files linked to the sample",
};

const COLUMN_NAMES: Record<string, string> = {
	name: "Sample Name",
	alias: "Alias",
	taxId: "Taxonomic Identifier",
	hostTaxId: "Host Taxonomic Identifier",
	mlst: "MLST",
	isolationSource: "Isolation Source",
	collectionDate: "Collection Date",
	location: "Geographical Location",
	sequencingLab: "Sequencing Lab",
	institution: "Institution (Data owner)",
	hostHealthState: "Host Health State",
	createdOn: "Created On",
	modifiedOn: "Modified On",
	files: "FASTQ Files",
};

function getColumnTooltip(key: string) {
	return COLUMN_TOOLTIPS[key] ?? "";
}

function getColumnNewName(key: string) {
	return COLUMN_NAMES[key] ?? "";
}

const formatDateToYMD = (dateStr?: string | null) =>
	dateStr ? new Date(dateStr).toISOString().split("T")[0] : "";

export function DataTable<T extends object>({
	data,
	columns,
	onOpen,
	onEdit,
	onDelete,
	showAddButton,
	project,
	filterPlaceholder = "Filter...",
}: DataTableProps<T>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [initialColumnOrder] = React.useState<string[]>([]);
	const [, setLoading] = useState(false);
	const queryClient = useQueryClient();

	const autoColumns: ColumnDef<T>[] = React.useMemo(() => {
		if (data.length === 0) return [];

		return (Object.keys(data[0]) as Array<keyof T>)
			.filter((key) => key !== "files")
			.map((key) => ({
				id: String(key),
				accessorKey: String(key),
				enableHiding: !NON_VIEWED_COLUMNS.includes(String(key)),
				header: (props) => (
					<DataTableColumnHeader
						column={props.column}
						title={getColumnNewName(String(key))}
					/>
				),
				meta: {
					label: getColumnNewName(String(key)),
				},
			}));
	}, [columns, data]);

	const orderedColumns = React.useMemo(() => {
		if (autoColumns.length === 0) return [];

		if (initialColumnOrder.length === 0) {
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

		const fileColumn: ColumnDef<T> = {
			id: "files",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title={getColumnNewName("files")}
				/>
			),
			cell: ({ row }) => {
				const sample = row.original as Sample;

				if (!sample.files || sample.files.length === 0) {
					return null;
				}

				return (
					<div className="flex flex-col gap-1">
						{sample.files.map((file, index) => (
							<button
								key={index}
								onClick={async () => {
									try {
										const { url } = await requestPresignedDownload({
											projectId: Number(project?.id),
											sampleName: sample.name,
											fileName: file.name,
										});

										window.open(url, "_blank");
									} catch (err: any) {
										toast.error(err?.message ?? "Download failed");
									}
								}}
								className="text-left text-blue-600 hover:underline"
							>
								{file.name}
							</button>
						))}
					</div>
				);
			},
			enableSorting: false,
			enableHiding: true,
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
											projectId={project?.id!}
											onUpdated={() => {
												if (onEdit) onEdit(row.original);
											}}
										/>
									)}

									<UploadDataDialog
										projectId={project?.id!}
										sampleName={(row.original as Sample).name}
									/>
									{onDelete && (
										<DeleteAlertButton
											projectId={project?.id!}
											item={row.original as { id: string }[]}
											entityName="sample"
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
			fileColumn,
			...(actionColumn ? [actionColumn] : []),
		];
	}, [autoColumns, onOpen, onEdit, onDelete]);

	const enhancedColumnsWithDates: ColumnDef<T>[] = React.useMemo(() => {
		return enhancedColumns.map((col) => {
			if (
				"accessorKey" in col &&
				(col.accessorKey === "createdOn" || col.accessorKey === "modifiedOn")
			) {
				return {
					...col,
					cell: ({ row }) => {
						const key = col.accessorKey as string;
						const dateStr = row.getValue(key) as unknown as string;
						if (!dateStr) return "";
						return formatDateToYMD(dateStr);
					},
				};
			}
			return col;
		});
	}, [enhancedColumns]);

	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({
			alias: false,
			taxId: true,
			hostTaxId: true,
			isolationSource: true,
			collectionDate: true,
			geoLocation: true,
			sequencingLab: false,
			institution: false,
			hostHealthState: false,
			createdOn: false,
			modifiedOn: false,
			lastUpdatedOn: false,
			id: false,
			mlst: false,
			files: true,
		});

	const table = useReactTable({
		data,
		columns: enhancedColumnsWithDates,
		initialState: {
			pagination: { pageSize: 15 },
		},
		state: {
			sorting,
			globalFilter,
			columnVisibility,
		},
		autoResetPageIndex: false,
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableRowSelection: true,
		onColumnVisibilityChange: setColumnVisibility,
	});

	table
		.getAllColumns()
		.filter(
			(column) =>
				!column.getCanHide() && !NON_VIEWED_COLUMNS.includes(column.id)
		);

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
				return {
					name: row.name,
					alias: row.alias,
					taxId: row.taxId,
					hostTaxId: row.hostTaxId,
					mlst: row.mlst,
					isolationSource: row.isolationSource,
					collectionDate: row.collectionDate,
					location: row.location,
					sequencingLab: row.sequencingLab,
					institution: row.institution,
					hostHealthState: row.hostHealthState,

					[colName]: value,
				};
			});

			batchEditSamples(project?.id!, { sampleData });

			toast.success("Samples have been updated");

			queryClient.invalidateQueries({
				queryKey: ["samples"],
			});
		} catch (err: any) {
			toast.error(err?.message ?? "Error updating samples");
		} finally {
			setLoading(false);
		}
	};

	const treeData = buildProjectTree(project!, selectedRows as any);

	const editableColumns = autoColumns.filter(
		(col) => !NON_EDITABLE_COLUMNS.includes(String(col.header))
	);

	const quickEditColumns = editableColumns.slice(1, QUICK_EDIT_LIMIT);
	const moreEditColumns = editableColumns.slice(QUICK_EDIT_LIMIT);

	console.log("table:", table);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-center space-x-2 lg:flex">
				<ProjectTree data={treeData} width={1200} />
			</div>

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
						{quickEditColumns.map((col) => (
							<>
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm" className="rounded-none">
											{col.meta?.label}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<form>
											<Input
												name="field"
												placeholder={String(col.meta?.label)}
												className="w-auto"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														const form = e.currentTarget.form;
														if (form) {
															const value = new FormData(form).get(
																"field"
															) as string;
															handleBatchUpdate(String(col.id), value);
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

								{moreEditColumns.map((col) => (
									<DropdownMenuItem key={String(col.meta?.label)} asChild>
										<Popover>
											<PopoverTrigger asChild>
												<Button variant="ghost" className="flex justify-start">
													{String(col.meta?.label)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="p-1">
												<Input
													name="field"
													placeholder={String(col.meta?.label)}
													className="w-auto"
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															const form = e.currentTarget.form;
															if (form) {
																const value = new FormData(form).get(
																	"field"
																) as string;
																handleBatchUpdate(String(col.id), value);
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
									projectId={project?.id!}
									item={selectedRows as { id: string }[]}
									entityName="sample"
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
										{header.isPlaceholder ? null : (
											<div className="flex items-center gap-1">
												<Tooltip>
													<TooltipTrigger asChild>
														<div>
															{flexRender(
																header.column.columnDef.header,
																header.getContext()
															)}
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<p>{getColumnTooltip(header.id)}</p>
													</TooltipContent>
												</Tooltip>
											</div>
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
	onUpdated,
}: {
	item: Sample;
	projectId: string;
	onUpdated?: () => void;
}) {
	const [loading, setLoading] = useState(false);

	const [openDrawer, setOpenDrawer] = useState(false);

	const queryClient = useQueryClient();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData(e.currentTarget);

			const rawData: Partial<CreateSample> = {
				name: formData.get("name") as string,
				alias: formData.get("alias") as string,
				taxId: formData.get("taxId") ? Number(formData.get("taxId")) : null,
				hostTaxId: formData.get("hostTaxId")
					? Number(formData.get("hostTaxId"))
					: null,
				mlst: formData.get("mlst") as string,
				isolationSource: formData.get("isolationSource") as string,
				collectionDate: formData.get("collectionDate") as string,
				location: formData.get("location") as string,
				sequencingLab: formData.get("sequencingLab") as string,
				institution: formData.get("institution") as string,
				hostHealthState: formData.get("hostHealthState") as string,
			};

			const updateData = emptyToNull(rawData);

			await updateSample(projectId, item.id, updateData);

			toast.success("Sample has been updated", {
				description: `${new Date().toLocaleString()}.`,
			});

			queryClient.invalidateQueries({
				queryKey: ["samples"],
			});

			if (onUpdated) onUpdated();
		} catch (err: any) {
			toast.error(err?.message || "Erro updating sample");
		} finally {
			setLoading(false);
		}
	};

	console.log("item:", item);

	return (
		<Drawer
			direction="right"
			open={openDrawer}
			onOpenChange={setOpenDrawer}
			autoFocus={openDrawer}
		>
			<DrawerTrigger asChild>
				<Button
					variant="ghost"
					className="text-foreground w-full justify-start gap-2 text-left"
					size={"sm"}
				>
					<SquarePen size={6} />
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
						{Object.keys(item)
							.filter(
								(field) =>
									!NON_EDITABLE_COLUMNS.includes(field) && field !== "id"
							)
							.map((field) => {
								const rawValue = item[field as keyof Sample];

								const isDateField = field.toLowerCase().includes("date");

								const formattedValue = isDateField
									? formatDateToYMD(rawValue as string)
									: String(rawValue ?? "");

								return (
									<div key={field} className="flex flex-col gap-3">
										<Label htmlFor={field}>{getColumnNewName(field)}</Label>

										<Input
											id={field}
											name={field}
											type={isDateField ? "date" : "text"}
											onPointerDown={(e) => e.stopPropagation()}
											defaultValue={formattedValue}
											className="grid grid-cols-1 place-content-around"
										/>
									</div>
								);
							})}
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
