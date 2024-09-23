'use client'

import { cn } from '@kit/ui/utils'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import useLocalStorage from '../lib/hooks/use-local-storage'
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
  const [aiState] = useAIState<typeof AI>()

  useEffect(() => {
    // TODO: Complete when setup is properly done
    //aiState.done()
  }, [subscribedMessages])
  
  const router = useRouter()

  const [input, setInput] = useState('')

 /**
  const [_, setNewThreadId] = useLocalStorage('newThreadId', id)

  useEffect(() => {

    setNewThreadId(id)
    console.log(id)

  }, [id])
  */

  const { messagesRef, scrollRef, visibilityRef, scrollToBottom, isVisible } = useScrollAnchor()
  
  return (
    <div className='flex flex-row relative size-full group'>
      <div className="w-full h-full relative flex flex-col justify-between">
        <ScrollArea className="" ref={scrollRef}>
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
