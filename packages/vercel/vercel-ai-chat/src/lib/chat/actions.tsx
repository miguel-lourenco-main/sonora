'use server'

import {
  createAI,
  getMutableAIState,
  getAIState,
} from 'vercel-sdk-core/rsc'
import { BotMessage } from '../../components/stocks'
import {
  nanoid,
} from '../utils'
import { getChat, saveChat, uploadFiles } from '../actions'
import {
  SkeletonMessage,
  UserMessage
} from '../../components/stocks/message'
import { Chat, Message, PlainFileObject } from '../types'
import { getAuthToken } from '@kit/supabase/get-auth-token'
import { Session } from 'edgen/models/components'
import { generateTextWorkflow } from 'vercel-sdk-core'
import { createEdgen } from 'vercel-sdk-edgen'
import { revalidatePath } from 'next/cache'
import { CHAT_PAGE_PATH } from '@kit/shared/constants'
import { processChatMessages } from '@kit/shared/utils'


async function submitUserMessage(content: string, workflowId?: number, convertedFiles?: PlainFileObject[]): Promise<{
  chatId: string | undefined
  id: string;
  display: string;
  fileSubmissions: string[][]
}> {
  'use server'

  if (!content) {
    return {
      chatId: undefined,
      id: nanoid(),
      display: "vercel:askMessage",
      fileSubmissions: []
    }
  }

  const aiState = getMutableAIState<typeof AI>()

  let textValue = ''

  let fileSubmissions: string[][] = []

  try {
    const auth_token = await getAuthToken()

    if (!auth_token) {
      throw new Error('No auth token')
    }

    //TODO: FIX
    /**
     * const client = undefined as any//getEdgenSDKClient({ oAuth2PasswordBearer: auth_token })

    const sessions = await client.listSessionsSessionsGet()

    // TODO: get workflowId
    let currentSession = sessions.find(session =>
      session.id ? session.id.toString() === aiState.get().chatId : false
    )

     */

    let sessionWorkflowId = -1

    let currentSession = false

    // FOR NOW, IF THERE IS NO SESSION, CREATE A NEW ONE
    if (!currentSession) { //|| !currentSession.workflowId
      const name = content.substring(0, 100)

      // TODO: In case there is a need to translate this default session, then the string value
      // needs to be passed to the function
      const chat: Session = {
        name,
        workflowId,
        description: 'Default Session'
      }

      const newChat = await saveChat(chat)

      if (!newChat || !newChat.id || !newChat.workflowId) {
        throw new Error('Error creating chat')
      }

      sessionWorkflowId = newChat.workflowId

      aiState.done({
        ...aiState.get(),
        chatId: newChat.id.toString()
      })

      if(convertedFiles && convertedFiles.length > 0){
        const res = await uploadFiles(newChat.id.toString(), convertedFiles)
        fileSubmissions = res
      }
    } else {
      sessionWorkflowId = 1//currentSession.workflowId
    }

    const provider = createEdgen({
      apiKey: auth_token
    })

    const { text } = await generateTextWorkflow({
      sessionWorkflow: provider(
        parseInt(aiState.get().chatId),
        sessionWorkflowId
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
    chatId: aiState.get().chatId,
    fileSubmissions,
    id: nanoid(),
    display: textValue
  }
}

export type AIState = {
  chatId: string
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
  initialAIState: { chatId: "-1", messages: [] },
  onGetUIState: async () => {
    'use server'

    const auth_token = await getAuthToken()

    if (auth_token) {
      const aiState = getAIState<typeof AI>()

      const chat = await getChat(aiState.chatId)

      if (chat) {
        const uiState = getUIStateFromAIState(chat)
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

  function processMessages(messages: Message[], result: UIState): UIState {
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

  return processMessages(processChatMessages(aiState.messages), [])
}