"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../../shadcn/checkbox"
import { DataTableColumnHeader} from "../data-tables"
import { TranslationFile } from "../_lib/interface"
import { Download, Eye } from "lucide-react"
import PDFViewerDrawer from "../simple/pdf-viewer-drawer"
import TooltipComponent from "../simple/tooltip-component"
import { useTranslation } from "react-i18next"
import PDFViewerDialog from "../simple/pdf-viewer-dialog"

// TODO: check why row.getValue is not working
export function columns(
  files: File[]
): ColumnDef<TranslationFile>[]{

  const { t } = useTranslation("ui")

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("id")} />
      ),
      cell: ({ row }) => {
        return(
          <div className="w-[20px]">{row.getValue("id")}</div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {

        const file = files.find(file => file.name === row.getValue("name"))

        return(
          <PDFViewerDrawer file={file ?? null} trigger={ <div className="w-[100px] whitespace-nowrap hover:underline hover:cursor-pointer">{row.getValue("name")}</div>} />
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "usage",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("usage")} />
        
      ),
      cell: ({ row }) => {
    
        return (
          <div className="relative flex flex-1 truncate items-start">
            {row.getValue("usage")}    
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
        
      ),
      cell: ({ row }) => {
    
        return (
          <div className="relative flex flex-1 truncate items-start">
            {row.getValue("status")}    
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
    
        const file = files.find(file => file.name === row.getValue("name"))

        const viewFilesButton = (
          <PDFViewerDialog 
            file={file ?? null} 
            trigger={ 
              <button
                className="flex size-fit items-center p-1.5 font-medium gap-x-2 text-foreground hover:text-foreground/60 bg-muted rounded-lg"
              >
                <TooltipComponent 
                  trigger={
                    <Eye className="h-[18px] w-[18px]"/>
                  }
                  content={t("viewFiles")}
                />
              </button>
            } 
          />
        )

        const donwloadOutputFile = (
          <TooltipComponent
            trigger={
              <button
                className="flex flex-row w-fit items-center p-1.5 font-medium gap-x-2 text-foreground hover:text-foreground/60 bg-muted rounded-lg"
              >
                <Download className="h-[18px] w-[18px]"/>
              </button>
            }
            content={t("downloadOutputFile")}
          />
        )
  
        return(
          <div className="flex flex-row w-full gap-x-4 justify-center">
            {viewFilesButton}
            {donwloadOutputFile}
            {/**<DataTableRowActions row={row} actions={actions}/> */}
          </div>
        )
      },
    },
  ]
}
