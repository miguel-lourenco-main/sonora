'use client'

import { Separator } from '@kit/ui/separator'
import { UIState } from '../lib/chat/actions'
import { cn } from '@kit/ui/utils'
import { useIsRightSidebarOpen } from '../lib/hooks/use-open-files'
import { useCallback, useEffect, useState } from 'react'
import { FillerComponent } from './filler-component'

export interface ChatList {
  messages: UIState
  isShared: boolean
}

export function ChatList({ messages, isShared }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className='flex'>
      <div className="relative mx-auto lg:w-[34rem] xl:w-[40rem] px-4">
        {messages.map((message, index) => (
          <div key={message.id}>
            {message.display}
            {index < messages.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
      <FillerComponent />
    </div>
  )
}
