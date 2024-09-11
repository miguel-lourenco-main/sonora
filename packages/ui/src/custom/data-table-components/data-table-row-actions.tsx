"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "../../shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu"
import { v4 as uuidv4 } from "uuid"
import { useTranslation } from "react-i18next"

interface DataTableRowActionsProps<TData> {     
  row: Row<TData>
  actions: DataTableActions[]
}

interface DataTableActions {
  name: string
  exec: () => void
  customItem: (() => JSX.Element) | null
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {

  const {t} = useTranslation("ui")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">
            {t("openMenu")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[13rem]">
        {actions.map((action, i) => {
          return (
            <div key={uuidv4()} 
            >
              {action.customItem ? (
                <action.customItem/>
              ):(
                <>
                  {i !== 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem 
                    onClick={() => action.exec()}
                  >
                    {action.name}
                  </DropdownMenuItem>
                </>
              )}
            </div>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
