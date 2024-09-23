'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthToken } from '@kit/supabase/get-auth-token'
import { EDGEN_CHAT_PAGE_PATH } from '@kit/shared/constants'
import { cache } from 'react'
import { Thread } from './interfaces'
import { Edgen } from "edgen-typescript/dist";
import { HTTPClient } from "edgen-typescript/dist/lib/http";
import { RetryConfig } from "edgen-typescript/dist/lib/retries";
import { EDGEN_BACKEND_URL } from "@kit/shared/constants"

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

export async function createThread(id: string) {
  try{

    const auth_token = await getAuthToken()

    if(!auth_token || !id) throw Error("No auth token or id")

    // TODO: insert deleteLogic

  }catch(error){
    console.log(error)

  }finally{
    revalidatePath(EDGEN_CHAT_PAGE_PATH)
    //return revalidatePath(path)
    return {
      id: "-1",
      messages: []
    }
  }
}

export const loadThreads = cache(async () => {
  return await getThreads()
}) 

export async function getThreads() {

  try {

  } catch (error) {

    console.log(error)
    return null

  }finally{
    return []
  }
}

export async function getThread(id: string) {

  let thread: Thread | null = null

  try {

    /**
     * const auth_token = await getAuthToken()

    if(!auth_token || !id) throw Error("There is no token or id")

    const response = await loadChats()

    const foundChat = response.find((chat) => chat.id === parseInt(id))

    if(!foundChat) throw Error("Failed to get chat from chats")

    const client = getEdgenSDKClient({ oAuth2PasswordBearer: auth_token });

    // Add the messages to the chat
    const messages = await client.listMessagesSessionsSessionIdMessagesGet({sessionId: parseInt(id)})

    chat = {...foundChat, messages}
     */

  } catch (error) {

    console.log(error)
    return null

  }finally{
    return thread
  }
}


export async function deleteThread(id: string, path: string ) {
  
  try{

    const auth_token = await getAuthToken()

    if(!auth_token || !id) throw Error("No auth token or id")

    // TODO: insert delete logic

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

    // TODO: insert delete logic

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

    // TODO: insert delete logic

  }catch(error){
    console.log(error)
  }finally{
    return []
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}