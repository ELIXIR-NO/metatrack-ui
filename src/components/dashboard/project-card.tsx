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
import { FolderOpen, MoreHorizontal, SquarePen } from "lucide-react";
import { AddProjectDialog } from "./add-project";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTablePagination } from "../data-table-pagination";
import { DataTableViewOptions } from "../data-table-column-toggle";
import { Project } from "@/lib/types";
import { DeleteAlertButton } from "../delete-alert-button";
import { DownloadTemplateButton } from "./download-template-button";

interface DataTableProps {
	projects: Project[];
	onEdit: (project: Project) => void;
	onDelete: (project: Project) => void;
	onOpen: (project: Project) => void;
}

export function ProjectsDataTable({
	projects,
	onEdit,
	onDelete,
	onOpen,
}: DataTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = React.useState("");

	const columns = React.useMemo<ColumnDef<Project>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={table.getIsAllPageRowsSelected()}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
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
			},
			{
				accessorKey: "name",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="Title" />
				),
				cell: ({ row }) => (
					<span
						className="cursor-pointer font-medium"
						onClick={() => onOpen(row.original)}
					>
						{row.getValue("name")}
					</span>
				),
			},
			{
				accessorKey: "description",
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title="Description" />
				),
				cell: ({ row }) => row.getValue("description") || "-",
			},
			{
				id: "actions",
				enableHiding: false,
				cell: ({ row }) => {
					const project = row.original;
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreHorizontal size={16} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() => onOpen(project)}
									className="flex items-center gap-2"
								>
									<FolderOpen />
									Open
								</DropdownMenuItem>

								<DropdownMenuItem
									onClick={() => onEdit(project)}
									className="flex items-center gap-2"
								>
									<SquarePen />
									Edit
								</DropdownMenuItem>

								<DropdownMenuItem asChild>
									<DeleteAlertButton
										projectId={project?.id}
										item={{ id: project.id! }}
										entityName="project"
										onDeleted={() => onDelete(project)}
									/>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[onEdit, onDelete, onOpen]
	);

	const table = useReactTable({
		data: projects,
		columns,
		initialState: {
			pagination: {
				pageSize: 15,
			},
		},
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between space-x-4">
				<Input
					placeholder="Filter projects..."
					value={globalFilter ?? ""}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className="max-w-sm"
				/>
				<DataTableViewOptions table={table} />
				<DownloadTemplateButton />
				<AddProjectDialog />
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
									colSpan={columns.length}
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
