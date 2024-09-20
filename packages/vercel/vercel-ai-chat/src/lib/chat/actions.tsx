import 'server-only'

import {
  createAI,
  getMutableAIState,
  getAIState,
} from 'vercel-sdk-core/rsc'
import {
  nanoid,
} from '../utils'
import { getThread, createThread } from '../actions'
import { Chat, Message } from '../types'
import { getAuthToken } from '@kit/supabase/get-auth-token'
import { generateTextWorkflow } from 'vercel-sdk-core'
import { createEdgen } from 'vercel-sdk-edgen'
import { revalidatePath } from 'next/cache'
import { CHAT_PAGE_PATH } from '@kit/shared/constants'
import { Thread } from '../interfaces'


async function submitUserMessage(threadId: string | undefined, content: string): Promise<{
  id: string;
  display: string;
}> {
  'use server'

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

    if (!threadId) {
      const name = content.substring(0, 100)

      const thread: Thread = {
        id: nanoid(),
        name,
        messages: [
          content
        ]
      }

      const newThread = await createThread(thread.id)

      if (!newThread || !newThread.id) {
        throw new Error('Error creating thread')
      }

      aiState.done({
        ...aiState.get(),
        threadId: newThread.id.toString()
      })
    } 

    const provider = createEdgen({
      apiKey: auth_token
    })

    const { text } = await generateTextWorkflow({
      threadModel: provider(
        aiState.get().threadId,
      ),
      prompt: content
    })

    textValue = text

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, aiState.get().messages.length - 1),
        {
          id: -1,
          sender: 'user',
          receiver: 'assistant',
          content
        },
        {
          id: -1,
          sender: 'assistant',
          receiver: 'user',
          content: text
        }
      ]
    })
  } catch (e) {
    console.log(e)
    textValue = 'vercel:errorChatMessage'
  }

  if (textValue === '')
    textValue = 'vercel:errorChatMessage'

  revalidatePath(CHAT_PAGE_PATH)

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

      const thread = await getThread(aiState.threadId)

      if (thread) {
        const uiState = getUIStateFromAIState(thread)
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

export const getUIStateFromAIState = async (aiState: Chat) => {
  // Get messages since the ones in aiState are empty

  /**
   * function processMessages(messages: Message[], result: UIState): UIState {
    const currentMessage = messages.pop()

    if (!currentMessage){
      return result
    }

    // TODO: might need to increase number of roles to check
    if (currentMessage.sender === 'user') {
      result = [
        {
          id: `${aiState.id ?? '-1'}-${result.length}`,
          display: <UserMessage>{currentMessage.content as string}</UserMessage>
        },
        ...result
      ]
    } else if (currentMessage.sender === 'assistant') {
      result = [
        {
          id: `${aiState.id ?? '-1'}-${result.length}`,
          display: <BotMessage content={currentMessage.content as string} />
        },
        ...result
      ]
    } else if (currentMessage.sender === 'skeleton') {
      result = [
        {
          id: `${aiState.id ?? '-1'}-${result.length}`,
          display: <SkeletonMessage event={currentMessage.content as string} />
        },
        ...result
      ]
    }

    return processMessages(messages, result)
  }
   */

  return [{
    id: "-1",
    display: <></>
  }]//processMessages(processChatMessages(aiState.messages), [])
}