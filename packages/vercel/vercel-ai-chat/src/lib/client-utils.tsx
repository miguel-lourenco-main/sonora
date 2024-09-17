import * as React from 'react'

import type { UIState } from './chat/actions'
import { nanoid } from 'nanoid'
import { BotMessage, SkeletonMessage, UserMessage } from '../components/stocks/message'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { PlainFileObject } from './types'
import { fileToObject } from './utils'
import { CHAT_PAGE_PATH } from '@kit/shared/constants'


export async function processSubmitMessage(
  setMessages: React.Dispatch<React.SetStateAction<UIState>>, 
  value: string, 
  submitUserMessage: (value: string, selectedWorkflowId?: number, convertedFiles?: PlainFileObject[]) => Promise<any>,
  selectedWorkflowId: number,
  router: AppRouterInstance,
  pathname: string,
  translationFunc: (key: string) => string,
  scrollToBottom?: () => void,
  onHoldFiles?: File[],
  setOnHoldFiles?: (onHoldFiles: File[]) => void,
  setCheckNewFiles?: (hasNewFiles: boolean) => void
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

  const convertedFiles = onHoldFiles && onHoldFiles.length > 0 ? await Promise.all(onHoldFiles.map((file) => fileToObject(file))) : []

  // Submit and get response message
  const responseMessage = await submitUserMessage(value, selectedWorkflowId, convertedFiles)

  const message = {
    id: responseMessage.id,
    display: (responseMessage.display as string).startsWith("vercel:") 
            ? <BotMessage content={translationFunc(responseMessage.display)} />
            : <BotMessage content={responseMessage.display} />
  }

  setMessages(currentMessages => [...currentMessages.slice(0, -1), message])

  if(scrollToBottom) scrollToBottom() // TODO: try it for now but I might need to remove this

  if(setOnHoldFiles && onHoldFiles && responseMessage.fileSubmissions.length > 0){
    // Remove from onHoldFiles the files that were successfully submitted
    setOnHoldFiles(onHoldFiles.filter((file) => !responseMessage.fileSubmissions[0].includes(file.name)))
  }

  if (pathname !== `${CHAT_PAGE_PATH}/${responseMessage.chatId}`) {
    if(setCheckNewFiles) setCheckNewFiles(true)
    router.push(`${CHAT_PAGE_PATH}/${responseMessage.chatId}`)
  }
}