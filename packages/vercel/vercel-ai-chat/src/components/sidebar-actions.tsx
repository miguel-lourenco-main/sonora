'use client'

import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { ServerActionResult, type Chat } from '../lib/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@kit/ui/alert-dialog'
import { Button } from '@kit/ui/button'
import { IconSpinner, IconTrash } from '@kit/ui/icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@kit/ui/tooltip'
import { getAuthToken } from '@kit/supabase/get-auth-token'
import { revalidatePath } from 'next/cache'
import { I18nComponent } from '@kit/i18n'
import { CHAT_PAGE_PATH } from '@kit/shared/constants'

interface SidebarActionsProps {
  chat: Chat
  removeChat: (args: { id: string; path: string }) => ServerActionResult<void>
}

export function SidebarActions({ chat, removeChat }: SidebarActionsProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()

  const pathname = usePathname()

  return (
    <>
      <div className="">
        {/**
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="size-7 p-0 hover:bg-background"
                onClick={() => setShareDialogOpen(true)}
              >
                <IconShare />
                <span className="sr-only">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share chat</TooltipContent>
          </Tooltip>
         */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="size-7 p-0 hover:bg-background"
                disabled={isRemovePending}
                onClick={() => setDeleteDialogOpen(true)}
              >
                <IconTrash />
                <span className="sr-only">
                  <I18nComponent i18nKey={'vercel:delete'}/>
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <I18nComponent i18nKey={'vercel:deleteChat'}/>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <I18nComponent i18nKey={'vercel:areYouAbsolutelySure'}/>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <I18nComponent i18nKey={'vercel:thisWillPermanentlyDeleteYourChatMessageAndRemoveYourDataFromOurServers'}/>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              <I18nComponent i18nKey={'vercel:cancel'}/>
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={event => {
                event.preventDefault()
                // @ts-ignore
                startRemoveTransition(async () => {

                  const auth_token = await getAuthToken()

                  if(auth_token && chat.id){

                    const result = await removeChat({
                      id: chat.id.toString(),
                      path: chat.path,
                    })
  
                    if (result && 'error' in result) {
                      toast.error(result.error)
                      return
                    }

                    setDeleteDialogOpen(false)

                    if(pathname === chat.path) router.push(CHAT_PAGE_PATH)
                    revalidatePath(CHAT_PAGE_PATH)
                    toast.success('Chat deleted')
                  }
                })
              }}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              <I18nComponent i18nKey={'vercel:delete'}/>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
