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
} from "../shadcn/table"
import { DataTablePagination } from "./data-table-components/data-table-pagination"
import { DataTableToolbar } from "./data-table-components/data-table-toolbar"
import { Filter } from "./_lib/interface"
import FilesDragNDrop from "./files-drag-n-drop"
import I18nComponent from "@kit/ui/i18n-component"


import { TrackableFile } from "@kit/shared/types"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  tableLabel: string
  rowOnClick: (id: string) => void
  filters: Filter[]
  toolBarButtons: (rowSelection?: RowSelectionState, setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>, hasSelected?: boolean) => React.JSX.Element
  files?: TrackableFile[]
  setFiles?: React.Dispatch<React.SetStateAction<TrackableFile[]>>
  removeFiles?: (files: TrackableFile[]) => void
  addFiles?: (files: TrackableFile[]) => void
  identifier?: string
}

// TODO: standardize table column sizes, right now, they vary depending on it's child size

export function DragNDropTable<TData, TValue>({
  columns,
  data,
  tableLabel,
  rowOnClick,
  filters,
  toolBarButtons,
  files,
  setFiles,
  addFiles,
  removeFiles,
  identifier = "name"
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

    return toolBarButtons(rowSelection, setRowSelection, table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())

  }, [setRowSelection, rowSelection, table, toolBarButtons])

  const handleAddFiles = (files: TrackableFile[]) => {
    if(addFiles) {
      addFiles(files)
    }else if(setFiles) {
      setFiles(prevFiles => [...prevFiles, ...files])
    }
  }

  const handleRemoveFiles = (files: TrackableFile[]) => {
    if(removeFiles) {
      removeFiles(files)
    }else if(setFiles) {
      setFiles(prevFiles => prevFiles.filter(file => !files.includes(file)))
    }
  }

  return (
    <div className="flex flex-col justify-center space-y-4 h-full">
      {files && files.length > 0 && (
        <DataTableToolbar identifier={identifier} table={table} tableLabel={tableLabel} filters={filters} toolBarButtonsProcessed={toolBarButtonsProcessed}/>
      )}
      <FilesDragNDrop
        files={files ?? []}
        addFiles={handleAddFiles}
        removeFiles={handleRemoveFiles}
      >
        <div className="rounded-md border h-full">
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
                    onClick={() => rowOnClick(row.getValue("id"))}
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
      </FilesDragNDrop>
      {files && files.length > 0 && <DataTablePagination table={table} />}
    </div>
  )
}