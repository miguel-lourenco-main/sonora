'use client'

import { cn } from '@kit/ui/utils'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { useEffect, useState } from 'react'
import { useUIState, useAIState } from 'vercel-sdk-core/rsc'
import { Message } from '../lib/types'
import { useRouter } from 'next/navigation'
import { useScrollAnchor } from '../lib/hooks/use-scroll-anchor'
import { ScrollArea } from '@kit/ui/scroll-area'
import { AI } from '../lib/chat/actions'

export interface ChatProps extends React.ComponentProps<'div'> {
  id: string
  subscribedMessages: Message[]
}

export function Chat({ id, className, subscribedMessages }: ChatProps) {

  const [messages] = useUIState<typeof AI>()

  const [input, setInput] = useState('')

  const { messagesRef, scrollRef, visibilityRef, scrollToBottom, isVisible } = useScrollAnchor()
  
  return (
    <div className='flex flex-row relative size-full group'>
      <div className="w-full h-full relative top-0 left-0 flex flex-col justify-between">
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className={cn('pb-[200px] pt-24', className)} ref={messagesRef}>
            {messages.length ? (
              <ChatList messages={messages} isShared={false} />
            ) : (
              <></>
            )}
            <div className="w-full h-px" ref={visibilityRef} />
          </div>
        </ScrollArea>
        <div className='flex'>
          <ChatPanel
            id={id}
            input={input}
            setInput={setInput}
            isAtBottom={isVisible}
            scrollToBottom={scrollToBottom}
          />
        </div>
      </div>
    </div>
  )
}
