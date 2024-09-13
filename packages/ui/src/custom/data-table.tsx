"use client"

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
import { I18nComponent } from "@kit/i18n"
import { useCallback, useEffect, useState, useRef } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  tableLabel: string
  filters: Filter[]
  onRowClick: (id: string) => void
  createToolbarButtons: (rowSelection?: RowSelectionState, setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>, hasSelected?: boolean) => React.JSX.Element
  identifier?: string
  initialSorting?: SortingState
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
  initialSorting = []
}: DataTableProps<TData, TValue>) {

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const lastValidPageIndexRef = useRef(0)
  const isDataChangingRef = useRef(false)

  const firstTryRef = useRef(true)

  /**
   * TODO: current solution to deal with pagination not resetting when data changes is to reset the page index to 0
   *        can be problematic. If possible come up witha better solution
   */

  const handlePaginationChange = useCallback((updater: any) => {
    firstTryRef.current = false

    if (isDataChangingRef.current) {
      isDataChangingRef.current = false
      return
    }

    if (typeof updater === 'function') {

      const newState = updater({ pageIndex, pageSize })

      setPageSize(newState.pageSize)
      setPageIndex(newState.pageIndex)

      lastValidPageIndexRef.current = newState.pageIndex

    } else {
      
      setPageSize(updater.pageSize)
      setPageIndex(updater.pageIndex)

      lastValidPageIndexRef.current = updater.pageIndex
    }
  }, [pageIndex, pageSize])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: handlePaginationChange,
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

  useEffect(() => {
    if(!firstTryRef.current) {
      isDataChangingRef.current = true
    }

    setPageIndex(lastValidPageIndexRef.current)

  }, [data])

  const toolBarButtonsProcessed = useCallback(() => {

    return createToolbarButtons(rowSelection, setRowSelection, table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())

  }, [createToolbarButtons, setRowSelection, rowSelection])

  return (
    <div className="flex flex-col h-full space-y-4">
      <DataTableToolbar 
        identifier={identifier} 
        table={table} 
        tableLabel={tableLabel} 
        filters={filters} 
        toolBarButtonsProcessed={toolBarButtonsProcessed}
      />
      <div className="relative flex-grow overflow-auto border rounded-md">
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
