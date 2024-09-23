'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthToken } from '@kit/supabase/get-auth-token'
import { EDGEN_CHAT_PAGE_PATH } from '@kit/shared/constants'
import { cache } from 'react'
import { Edgen } from "edgen-typescript/dist";
import { HTTPClient } from "edgen-typescript/dist/lib/http";
import { RetryConfig } from "edgen-typescript/dist/lib/retries";
import { EDGEN_BACKEND_URL } from "@kit/shared/constants"
import { toast } from 'sonner'
import { UIThread, Message } from './types' // Import UIThread and Message

export async function getEdgenSDKClient({
  bearerAuth,
  httpClient,
  serverIdx,
  serverURL,
  retryConfig
}: {
  bearerAuth?: string | (() => Promise<string>);
  httpClient?: HTTPClient;
  serverIdx?: number;
  serverURL?: string;
  retryConfig?: RetryConfig;
}){
  return new Edgen({
      bearerAuth,
      httpClient,
      serverIdx,
      serverURL: serverURL ?? EDGEN_BACKEND_URL,
      retryConfig
  });
}

export async function createThread(title: string) {

  try{

    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token or id")

    const client = await getEdgenSDKClient({ bearerAuth: auth_token })

    const thread = await client.threads.threadsCreate({
      title,
    })

    return thread

  }catch(error){
    console.log(error)
    return undefined

  }finally{
    revalidatePath(EDGEN_CHAT_PAGE_PATH)
  }
}

export async function runThread(threadId: string, message: string) {
  try{

    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token or id")

    const client = await getEdgenSDKClient({ bearerAuth: auth_token })

    const response = await client.threads.threadsRun({
      threadId,
      threadRun: {input: message}
    })

    return response

  }catch(error){
    console.log(error)

    const errorMessage = `Message request resulted in an error: ${error}`

    const truncatedMessage = errorMessage.slice(0, 100)
    const finalMessage = truncatedMessage.length < errorMessage.length ? `${truncatedMessage}...` : truncatedMessage

    return finalMessage

  }finally{
    revalidatePath(EDGEN_CHAT_PAGE_PATH)
  }
}

export const loadThreads = cache(async () => {
  return await getThreads()
}) 

export async function getThreads() {

  try {

    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token or id")

    const client = await getEdgenSDKClient({ bearerAuth: auth_token })

    const threadList = await client.threads.threadsList()

    // Transform threads to UIThread
    const uiThreadList: UIThread[] = await Promise.all(threadList.map(async (thread) => {
      const messages: Message[] = await getMessages(thread.id) // Fetch messages for each thread
      return {
        ...thread,
        path: `/app/chat/${thread.id}`,
        title: thread.title ?? "Untitled",
        messages,
        sharePath: `/app/share/${thread.id}`
      }
    }))

    return uiThreadList

  }catch (error) {

    console.log(error)
    return null

  }finally{
    revalidatePath(EDGEN_CHAT_PAGE_PATH)
  }
}

export async function getThread(id: string) {

  try {

    const auth_token = await getAuthToken()

    if(!auth_token || !id) throw Error("There is no token or id")

    const client = await getEdgenSDKClient({ bearerAuth: auth_token })

    // Add the messages to the chat
    const thread = await client.threads.threadsGet({threadId: id})

    return thread

  } catch (error) {

    console.log(error)
    return null

  }finally{
    revalidatePath(EDGEN_CHAT_PAGE_PATH)
  }
}


export async function deleteThread(id: string, path: string ) {
  
  try{

    const auth_token = await getAuthToken()

    if(!auth_token || !id) throw Error("No auth token or id")

    const client = await getEdgenSDKClient({ bearerAuth: auth_token })

    // Add the messages to the chat
    const thread = await client.threads.threadsDelete({threadId: id})

  }catch(error){
    console.log(error)

  }finally{
    revalidatePath(EDGEN_CHAT_PAGE_PATH)
    return revalidatePath(path)
  }
}

export async function deleteAllThreads() {

  try{

    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token")

    const client = await getEdgenSDKClient({ bearerAuth: auth_token })

    const threadList = await client.threads.threadsList()

    for(const thread of threadList){
      client.threads.threadsDelete({threadId: thread.id}).then((response) => {
        console.log(response)
        toast.success("Thread deleted")
      })
    }

  }catch(error){
    console.log(error)
  }finally{
    revalidatePath(EDGEN_CHAT_PAGE_PATH)
    return redirect(EDGEN_CHAT_PAGE_PATH)
  }
}

export async function getMessages(threadId: string) {
  try{

    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token")

    const client = await getEdgenSDKClient({ bearerAuth: auth_token })

    const messages = await client.messages.messagesList()

    const threadMessages = messages.filter((message) => message.threadId === threadId)

    return threadMessages

  }catch(error){
    console.log(error)
  }finally{
    return []
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}