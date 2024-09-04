"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../../shadcn/checkbox"
import { DataTableColumnHeader} from "../data-tables"
import { TranslationFile } from "../_lib/interface"
import { BanIcon, CheckCircle2Icon, CheckCircleIcon, CirclePause, Download, Eye, Loader2Icon, XCircleIcon } from "lucide-react"
import PDFViewerDrawer from "../simple/pdf-viewer-drawer"
import TooltipComponent from "../simple/tooltip-component"
import { useTranslation } from "react-i18next"
import PDFViewerDialog from "../simple/pdf-viewer-dialog"
import { Progress } from "../../shadcn/progress"
import { ReactNode, useEffect, useState } from "react"
import { cn } from "../../utils"

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
          <PDFViewerDrawer file={file ?? null} trigger={ <div className="w-[70%] truncate hover:underline hover:cursor-pointer">{row.getValue("name")}</div>} />
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

        //TODO: Make sure if when it fails, the usage is not counted

        const usage: () => ReactNode = () => {
          switch(row.getValue("status")){
            case "completed":
              return row.getValue("usage")
            case "failed":
              return "Translation failed. No usage."
            default:
              return "Waiting for translation to end..."
          }
        }
         
        return (
          <div className="relative flex flex-1 truncate items-start">
            {usage()}    
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

        // TODO: add status icon with the possibility of op

        const icon = () => {
          switch(row.getValue("status")){
            case "in_progress":
              return <TooltipComponent
                trigger={
                  <CirclePause className="h-[18px] w-[18px] stroke-yellow-600 cursor-pointer"/>
                }
                content={t("inProgress")}
              />
            case "completed":
              return <TooltipComponent
                trigger={
                  <CheckCircle2Icon className="h-[18px] w-[18px] stroke-green-500 cursor-pointer"/>
                }
                content={t("completed")}
              />
            case "failed":
              return <TooltipComponent
                trigger={
                  <BanIcon className="h-[18px] w-[18px] stroke-red-500 cursor-pointer"/>
                }
                content={t("failed")}
              />
            default:
              return <></>
          }
        }

        const [progress, setProgress] = useState(13)
 
        useEffect(() => {
          const timer = setTimeout(() => setProgress(66), 500)
          return () => clearTimeout(timer)
        }, [])

        const status = () => {
         switch(row.getValue("status")){
          case "in_progress":
            return <Progress value={progress} className="w-[100px]"/>
          case "completed":
            return t("completed")
          case "failed":
            return t("failed")
          default:
            return t("waitingForTranslationToEnd")
         }
        }
    
        return (
          <div className="relative flex flex-1 truncate items-center gap-x-2">
            {icon()}
            {status()}    
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
              <TooltipComponent 
                trigger={
                  <button
                    disabled={row.getValue("status") !== "completed"}
                    className={cn("flex size-fit items-center p-1.5 font-medium gap-x-2 text-foreground hover:text-foreground/60 bg-muted rounded-lg", row.getValue("status") !== "completed" ? "text-foreground/60 bg-muted/60" : "")}
                  >
                    <Eye className="h-[18px] w-[18px]"/>
                  </button>
                }
                content={t("viewFiles")}
              />
            }            
          />
        )

        const donwloadOutputFile = (
          <TooltipComponent
            trigger={
              <button
                disabled={row.getValue("status") !== "completed"}
                className={cn("flex size-fit items-center p-1.5 font-medium gap-x-2 text-foreground hover:text-foreground/60 bg-muted rounded-lg", row.getValue("status") !== "completed" ? "text-foreground/60 bg-muted/60" : "")}
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
