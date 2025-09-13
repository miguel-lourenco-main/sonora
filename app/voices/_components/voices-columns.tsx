"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@kit/ui/custom/data-table/data-table-components/data-table-column-header"
import { Check, Pencil, Trash, X, Loader2 } from "lucide-react"
import TooltipComponent from "@kit/ui/custom/tooltip-component"
import { cn } from '@kit/ui/lib'
import type { TFunction } from "i18next";
import { Voice } from "~/lib/hooks/use-voice-manager"
import { useState } from "react"
import { Input } from "@kit/ui/shadcn/input"
import { Button } from "@kit/ui/shadcn/button"
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { PreviewAudio } from './preview-audio';


const columnClasses = {
  base: "truncate",
  flexRow: "flex gap-x-4 items-center",
  select: "w-10",
  createdAt: "w-[12rem] min-w-[8rem] max-w-[12rem]",
  filename: "truncate w-[22rem]",
  targetLanguage: "w-1/3 min-w-[8rem] max-w-[12rem]",
  usage: "w-1/6 min-w-[8rem] max-w-[12rem]",
  status: "w-1/6 min-w-[8rem] max-w-[12rem]",
  actions: "w-full justify-end pr-6",
}

const useVoiceColumnState = (onRename: (id: string, name: string) => Promise<void>, t: TFunction) => {
  const { ready } = useTranslation('custom');
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleRename = async (id: string) => {
    if (!ready && process.env.NODE_ENV === 'development') return;
    if (editingName.trim()) {
      try {
        setIsLoading(id)
        await onRename(id, editingName.trim())
        setEditingId(null)
        setEditingName('')
        toast.success(t('voices.rename.success'))
      } catch (error) {
        toast.error(t('voices.rename.error'))
        console.error(error)
      } finally {
        setIsLoading(null)
      }
    }
  }

  const handleDelete = async (id: string, onDelete: (id: string) => Promise<void>) => {
    if (!ready && process.env.NODE_ENV === 'development') return;
    try {
      setIsLoading(id)
      await onDelete(id)
      toast.success(t('voices.delete.success'))
    } catch (error) {
      toast.error(t('voices.delete.error'))
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  return {
    editingId,
    editingName,
    isLoading,
    setEditingId,
    setEditingName,
    handleRename,
    handleDelete,
  }
}

export function useVoicesColumns(
  onDelete: (id: string) => Promise<void>, 
  onRename: (id: string, name: string) => Promise<void>, 
  t: TFunction<"custom", undefined>
): ColumnDef<Voice>[] {
  const state = useVoiceColumnState(onRename, t);
  
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("voices.table.name")} />
      ),
      cell: ({ row }) => {

        const voice = row.original;

        return (
          <TooltipComponent
            trigger={
              <div className={cn(columnClasses.base, "w-60")}>
                {state.editingId === voice.id ? (
                <div className="flex items-center space-x-2">
                    <Input
                        value={state.editingName}
                        onChange={(e) => state.setEditingName(e.target.value)}
                        className="h-8"
                    />
                    <Button size="sm" onClick={() => state.handleRename(voice.id)}>
                        <TooltipComponent
                            trigger={<Check className="h-4 w-4" />}
                            content={t('voices.rename.button')}
                        />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => state.setEditingId(null)}>
                        <TooltipComponent
                            trigger={<X className="h-4 w-4" />}
                            content={t('voices.rename.cancel')}
                        />
                    </Button>
                </div>
                ) : (
                voice.name
                )}
              </div>
            }
            content={row.getValue("name")}
          />
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("voices.table.createdAt")} />
      ),
      cell: ({ row }) => {
        const createdAt = new Date(row.getValue("created_at")).toLocaleString()

        console.log(row.getValue("created_at"))
        return (  
          <TooltipComponent
            trigger={
            <div className={cn(columnClasses.base, columnClasses.createdAt)}>
              {createdAt}
            </div>
          }
          content={createdAt}
        />
        )
      },
      sortingFn: 'datetime',
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "preview",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("voices.preview")} />
      ),
      cell: ({ row }) => {
        const voice = row.original;
        return (
            <PreviewAudio 
                voiceId={voice.voice_id} 
                voiceName={voice.name} 
            />
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {

        const voice = row.original;
        const loading = state.isLoading === voice.id;

        return(
          <div className={cn(columnClasses.base, columnClasses.actions, columnClasses.flexRow)}>
            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  state.setEditingId(voice.id)
                  state.setEditingName(voice.name)
                }}
                disabled={loading}
                className="mr-2"
              >
                <TooltipComponent
                    trigger={loading ? 
                        <Loader2 className="h-4 w-4 animate-spin" /> : 
                        <Pencil className="h-4 w-4" />
                    }
                    content={t('voices.rename.button')}
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => state.handleDelete(voice.id, onDelete)}
                disabled={loading}
              >
                <TooltipComponent
                    trigger={loading ? 
                        <Loader2 className="h-4 w-4 animate-spin" /> : 
                        <Trash className="h-4 w-4" />
                    }
                    content={t('voices.delete.button')}
                />
              </Button>
          </div>
        )
      },
    },
  ]
}

