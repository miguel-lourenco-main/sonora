'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { ServerActionResult } from '../lib/types'
import { Button } from '@kit/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@kit/ui/alert-dialog'
import { IconSpinner } from '@kit/ui/icons'
import { I18nComponent } from '@kit/i18n'

interface ClearHistoryProps {
  isEnabled: boolean
  clearChats: () => ServerActionResult<void>,
  auth_token?: string
}

export function ClearHistory({
  isEnabled = false,
  clearChats,
  auth_token
}: ClearHistoryProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" disabled={!isEnabled || isPending}>
          {isPending && <IconSpinner className="mr-2" />}
          <I18nComponent i18nKey={'vercel:clearHistory'}/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <I18nComponent i18nKey={'vercel:clearHistoryTitle'}/>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <I18nComponent i18nKey={'vercel:clearHistoryDescription'}/>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            <I18nComponent i18nKey={'vercel:cancel'}/>
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={event => {
              event.preventDefault()
              startTransition(async () => {
                const result = await clearChats()
                if (result && 'error' in result) {
                  toast.error(result.error)
                  return
                }

                setOpen(false)
              })
            }}
          >
            {isPending && <IconSpinner className="mr-2 animate-spin" />}
            <I18nComponent i18nKey={'vercel:delete'}/>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
