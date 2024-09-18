import * as React from 'react'

import type { UIState } from './chat/actions'
import { nanoid } from 'nanoid'
import { BotMessage, SkeletonMessage, UserMessage } from '../components/stocks/message'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { CHAT_PAGE_PATH } from '@kit/shared/constants'


export async function processSubmitMessage(
  setMessages: React.Dispatch<React.SetStateAction<UIState>>, 
  value: string, 
  submitUserMessage: (value: string, selectedWorkflowId?: number) => Promise<any>,
  selectedWorkflowId: number,
  router: AppRouterInstance,
  pathname: string,
  translationFunc: (key: string) => string,
  scrollToBottom?: () => void,
){
    
  setMessages(currentMessages => [
      ...currentMessages,
      {
          id: nanoid(),
          display: <UserMessage>{value}</UserMessage>
      },
      {
          id: nanoid(),
          display: <SkeletonMessage event={translationFunc('vercel:thinking')} />
      }
  ])

  if(scrollToBottom)scrollToBottom()

  // Submit and get response message
  const responseMessage = await submitUserMessage(value, selectedWorkflowId)

  const message = {
    id: responseMessage.id,
    display: (responseMessage.display as string).startsWith("vercel:") 
            ? <BotMessage content={translationFunc(responseMessage.display)} />
            : <BotMessage content={responseMessage.display} />
  }

  setMessages(currentMessages => [...currentMessages.slice(0, -1), message])

  if(scrollToBottom) scrollToBottom() // TODO: try it for now but I might need to remove this

  if (pathname !== `${CHAT_PAGE_PATH}/${responseMessage.chatId}`) {
    router.push(`${CHAT_PAGE_PATH}/${responseMessage.chatId}`)
  }
}