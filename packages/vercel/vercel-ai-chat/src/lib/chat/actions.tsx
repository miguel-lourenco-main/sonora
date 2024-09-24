import 'server-only'

import {
  createAI,
  getMutableAIState,
  getAIState,
} from 'vercel-sdk-core/rsc'
import {
  nanoid,
} from '../utils'
import { createThread, runThread, getMessages } from '../actions'
import { Message } from '../types'
import { getAuthToken } from '@kit/supabase/get-auth-token'
//import { generateTextWorkflow } from 'vercel-sdk-core'
//import { createEdgen } from 'vercel-sdk-edgen'
import { revalidatePath } from 'next/cache'
import { EDGEN_CHAT_PAGE_PATH } from '@kit/shared/constants'
import { BotMessage, SkeletonMessage, UserMessage } from '../../components/stocks/message'

async function submitUserMessage(threadId: string, content: string): Promise<{
  id: string;
  display: string;
}> {
  'use server'

  console.log(threadId)
  
  if (!content) {
    return {
      id: nanoid(),
      display: "vercel:askMessage",
    }
  }

  const aiState = getMutableAIState<typeof AI>()

  let textValue = ''

  try {
    const auth_token = await getAuthToken()

    if (!auth_token) {
      throw new Error('No auth token')
    }

    const text = await runThread(threadId, content)

    textValue = text

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, aiState.get().messages.length - 1),
        {
          accountId: "1",
          createdAt: new Date(),
          threadId: threadId,
          id: "-1",
          role: "Human",
          content
        },
        {
          accountId: "1",
          createdAt: new Date(),
          threadId: threadId,
          id: "-1",
          role: "Assistant",
          content: text
        }
      ]
    })
  } catch (e) {
    console.log(e)
    textValue = 'vercel:errorChatMessage'
  }

  if (textValue === '') textValue = 'vercel:errorChatMessage'

  revalidatePath(EDGEN_CHAT_PAGE_PATH)

  return {
    id: nanoid(),
    display: textValue
  }
}

export type AIState = {
  threadId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: { threadId: "-1", messages: [] },
  onGetUIState: async () => {
    'use server'

    const auth_token = await getAuthToken()

    if (auth_token) {
      const aiState = getAIState<typeof AI>()

      const messages = await getMessages(aiState.threadId)

      if (messages) {
        const uiState = await getUIStateFromAIState(messages)
        return uiState
      }

      return

    } else {
      console.log('No auth token: onGetUIState')
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    //  REASON: In our case, setAIState is not needed, since the data is stored and managed in the backend.
    // So there is no need to regularly save and update the AIState

    return
  }
})

export const getUIStateFromAIState = async (messages: Message[]) => {
  // Get messages since the ones in aiState are empty

  function processMessages(messages: Message[], result: UIState): UIState {
    const currentMessage = messages.pop()

    if (!currentMessage){
      return result
    }

    // TODO: might need to increase number of roles to check
    if (currentMessage.role === 'Human') {
      result = [
        {
          id: nanoid(),
          display: <UserMessage>{currentMessage.content as string}</UserMessage>
        },
        ...result
      ]
    } else if (currentMessage.role === 'Assistant') {
      result = [
        {
          id: nanoid(),
          display: <BotMessage content={currentMessage.content as string} />
        },
        ...result
      ]
    } else{
      result = [
        {
          id: nanoid(),
          display: <SkeletonMessage event={currentMessage.content as string} />
        },
        ...result
      ]
    }

    return processMessages(messages, result)
  }

  const uiState = processMessages(messages, []).map((message, i) => {
    return {
      id: i.toString(),
      display: message.display
    }
  })

  return uiState
}