"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  RowSelectionState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table"
import { DataTablePagination } from "./components/data-table-pagination"
import { DataTableToolbar } from "./components/data-table-toolbar"
import { Filter } from "./lib/interfaces"
import { useTranslation } from "react-i18next"
import { I18nComponent } from "@kit/i18n"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  tableLabel: string
  filters: Filter[]
  onRowClick: (id: string) => void
  createToolbarButtons: (rowSelection?: RowSelectionState, setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>, hasSelected?: boolean) => React.JSX.Element
  identifier?: string
}

// TODO: standardize table column sizes, right now, they vary depending on it's child size

export function CustomDataTable<TData, TValue>({
  columns,
  data,
  tableLabel,
  filters,
  onRowClick,
  createToolbarButtons,
  identifier = "name",
}: DataTableProps<TData, TValue>) {

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const toolBarButtonsProcessed = React.useCallback(() => {

    return createToolbarButtons(rowSelection, setRowSelection, table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())

  }, [setRowSelection, rowSelection])

  return (
    <div className="space-y-4 h-full">
      <DataTableToolbar identifier={identifier} table={table} tableLabel={tableLabel} filters={filters} toolBarButtonsProcessed={toolBarButtonsProcessed}/>
      <div className="rounded-md border h-[90%]">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
                  onClick={() => onRowClick(row.getValue("id") as string)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} >
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
                  <I18nComponent i18nKey="ui:noResults" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
