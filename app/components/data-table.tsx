We need to generate the content for app/components/data-table.tsx. The task is to create a shared data table component using shadcn/ui Table, with sorting, pagination, and row selection. This component should be reusable across pages (contacts, leads, activities, etc.). We'll design it to accept columns configuration, data, and callbacks for sorting, pagination, and row selection. We'll use shadcn/ui Table components (Table, TableHeader, TableRow, TableHead, TableBody, TableCell) and also include pagination (shadcn/ui Pagination) and row selection checkboxes. Also include state management for sorting, pagination, and selection. Use React hooks.

We need to ensure we import from @/components/ui/table, @/components/ui/button, @/components/ui/checkbox, etc. Since we are creating a new component, we must include all necessary imports. Also consider that sorting might use local state or external callbacks. We'll make the component flexible.

Also note the context: there is a repository with shadcn/ui, but we are only creating this one file. We'll produce the file content.

We should also include type definitions for columns. We'll define Column type with header, accessorKey or cell render. For sorting, we'll use a simple sort state and function.

Pagination: We'll implement with page numbers and page size. Row selection: use Checkbox component.

We'll create a DataTable component that takes columns, data, pageCount, onPaginationChange, onSortingChange, sorting, pagination, rowSelection, onRowSelectionChange, etc. This is similar to TanStack Table but simpler. However, we can implement a basic version.

Given task instructions, we need to deliver final file content only. No code fences.
"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  PaginationState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  enableRowSelection?: boolean;
  manualPagination?: boolean;
  manualSorting?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount: controlledPageCount,
  pagination: controlledPagination,
  onPaginationChange: controlledOnPaginationChange,
  sorting: controlledSorting,
  onSortingChange: controlledOnSortingChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange: controlledOnRowSelectionChange,
  enableRowSelection = false,
  manualPagination = false,
  manualSorting = false,
}: DataTableProps<TData, TValue>) {
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});

  const pagination = controlledPagination ?? internalPagination;
  const onPaginationChange = controlledOnPaginationChange ?? setInternalPagination;
  const sorting = controlledSorting ?? internalSorting;
  const onSortingChange = controlledOnSortingChange ?? setInternalSorting;
  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const onRowSelectionChange = controlledOnRowSelectionChange ?? setInternalRowSelection;

  const table = useReactTable({
    data,
    columns: enableRowSelection
      ? [
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
          ...columns,
        ]
      : columns,
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    enableRowSelection,
    onRowSelectionChange,
    onSortingChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    manualPagination,
    manualSorting,
    pageCount: controlledPageCount,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}