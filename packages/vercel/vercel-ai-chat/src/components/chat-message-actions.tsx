'use client'

import { type Message } from 'vercel-sdk-core/react'

import { Button } from '@kit/ui/button'
import { IconCheck, IconCopy } from '@kit/ui/icons'
import { useCopyToClipboard } from '@kit/shared/hooks'
import { cn } from '@kit/ui/utils'
import { I18nComponent } from '@kit/i18n'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0',
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onCopy}>
        {isCopied ? <IconCheck /> : <IconCopy />}
        <span className="sr-only">
          <I18nComponent i18nKey={'vercel:copyMessage'}/>
        </span>
      </Button>
    </div>
  )
}
