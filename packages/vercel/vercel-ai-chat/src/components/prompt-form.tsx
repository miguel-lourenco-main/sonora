'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'vercel-sdk-core/rsc'

import { type AI } from '../lib/chat/actions'
import { Button } from '@kit/ui/button'
import { IconArrowElbow, IconPlus } from '@kit/ui/icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@kit/ui/tooltip'
import { useEnterSubmit } from '../lib/hooks/use-enter-submit'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { processSubmitMessage } from '../lib/client-utils'

import { I18nComponent } from '@kit/i18n'
import { CHAT_PAGE_PATH } from '@kit/shared/constants'

export function PromptForm({
  input,
  setInput,
  scrollToBottom,
}: {
  input: string
  setInput: (value: string) => void
  scrollToBottom: () => void
}) {

  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()

  const { t } = useTranslation()
  
  const pathname = usePathname()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // TODO: check if having this many dependencies affects performance
  const submitMessage = React.useCallback((value: string) => {
    processSubmitMessage(setMessages, value, submitUserMessage, router, pathname, t, scrollToBottom)
  }, [setMessages, submitUserMessage, router, pathname, t, scrollToBottom])

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        submitMessage(value)
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background pl-2 pr-8 sm:rounded-md sm:border sm:pl-4 sm:pr-12">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] flex lg:hidden size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                if (pathname !== CHAT_PAGE_PATH) {
                  router.push(CHAT_PAGE_PATH)
                } else {
                  setMessages([])
                }
              }}
            >
              <IconPlus />
              <span className="sr-only">
                <I18nComponent i18nKey={'vercel:newChat'}/>
              </span>
            </Button>
          </TooltipTrigger>
            <TooltipContent>
              <I18nComponent i18nKey={'vercel:newChat'}/>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent pr-4 pl-12 lg:pl-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="icon" disabled={input === ''}>
                <IconArrowElbow />
                <span className="sr-only">
                  <I18nComponent i18nKey={'vercel:sendMessage'}/>
                </span>
              </Button>
              </TooltipTrigger>
              <TooltipContent>
                <I18nComponent i18nKey={'vercel:sendMessage'}/>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </form>
  )
}
