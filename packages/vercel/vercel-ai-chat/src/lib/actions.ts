'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { GeneratedFolder, InputFile, PlainFileObject, type Chat } from './types'
import { Session } from 'edgen/models/components'
import { getEdgenSDKClient } from '@kit/shared/utils'
import { getAuthToken } from '@kit/supabase/get-auth-token'
import { cache } from 'react'
import { convertToDate, fetchSS, objectToFile } from './utils'
import { TreeViewElement } from '@kit/ui/tree-view-api'
import { revalidateChatCache, revalidatePathServer } from './clear-next-cache'
import { CHAT_PAGE_PATH } from '@kit/shared/constants'

//TODO: add a flag to each function that determines if when an error occurs, if catched in the function or if it is thrown again when catched in the function

export const loadSession = cache(async (id: string) => {
  return await getSession(id)
})

export const loadWorkflows = cache(async () => {
  return await getWorkflows()
})

export const loadSessions = cache(async () => {
  return await getSessions()
})

export const loadChats = cache(async () => {
  return await getChats()
})

export async function getChats() {
  
  try {

    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("no auth token")

    const client = getEdgenSDKClient({ oAuth2PasswordBearer: auth_token });

    const response = await client.listSessionsSessionsGet();

    const chats = response.map((session) => {

      if(!session.id) return null

      const chat: Chat = {
        ...session,
        title: session?.name?.slice(0, 20) ?? "Undefined", // Consider using description, if there is one
        path: `${CHAT_PAGE_PATH}/${session.id}`,
        messages: []
      }

      return chat
    }).filter((session): session is Chat => session !== null)

    chats.sort((a, b) => parseInt(b.id?.toString() ?? "-1") - parseInt(a.id?.toString() ?? "-1"))

    return chats

  } catch (error) {
    console.log(error)
    return []
  }
}

export async function getChat(id: string) {

  let chat: Chat | null = null

  try {

    const auth_token = await getAuthToken()

    if(!auth_token || !id) throw Error("There is no token or id")

    const response = await loadChats()

    const foundChat = response.find((chat) => chat.id === parseInt(id))

    if(!foundChat) throw Error("Failed to get chat from chats")

    const client = getEdgenSDKClient({ oAuth2PasswordBearer: auth_token });

    // Add the messages to the chat
    const messages = await client.listMessagesSessionsSessionIdMessagesGet({sessionId: parseInt(id)})

    chat = {...foundChat, messages}

  } catch (error) {

    console.log(error)
    return null

  }finally{
    return chat
  }
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  
  try{

    const auth_token = await getAuthToken()

    if(!auth_token || !id) throw Error("No auth token or id")

    const client = getEdgenSDKClient({ oAuth2PasswordBearer: auth_token });

    await client.deleteSessionSessionsDeleteDelete({sessionId: parseInt(id)})

  }catch(error){
    console.log(error)

  }finally{
    revalidatePath(CHAT_PAGE_PATH)
    return revalidatePath(path)
  }
}

export async function clearChats() {

  try{

    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token")

    const chats = await getChats()

    if(!chats) throw Error("No chats")

    const client = getEdgenSDKClient({ oAuth2PasswordBearer: auth_token });

    for(const chat of chats){
      if(chat.id) await client.deleteSessionSessionsDeleteDelete({sessionId: chat.id})
    }

  }catch(error){
    console.log(error)
  }finally{
    revalidatePath(CHAT_PAGE_PATH)
    return redirect(CHAT_PAGE_PATH)
  }
}

export async function getSharedChat(id: string) {
  return null
}

export async function shareChat(id: string) {
  return {
    error: 'Unauthorized'
  }
}

export async function saveChat(chat: Session) {

  try{

    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token")

    const client = getEdgenSDKClient({ oAuth2PasswordBearer: auth_token });

    const response = await client.createSessionSessionsPost(chat)

    return response

  }catch(error){
    //console.log(error)
    return null
  }
}

export async function getSessions() {
  try{
    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token")

    const client = getEdgenSDKClient({ oAuth2PasswordBearer: auth_token })

    return await client.listSessionsSessionsGet()
    
  }catch(error){
    console.error(error)
    return []
  }
}

export async function getSession(id: string) {

  try{
    const sessions = await loadSessions()

    const session = sessions.find(
      session => session.id === parseInt(id ?? '')
    )

    return session
  }catch(error){
    console.error(error)
    return null
  }
}

export async function getWorkflows() {
  try{
    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token")

    const client = getEdgenSDKClient({ oAuth2PasswordBearer: auth_token })

    return await client.listWorkflowsWorkflowsGet()
  }catch(error){
    console.error(error)
    return []
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}


export const loadSessionFiles = cache(async (id: string) => {
  return await getSessionFiles(id)
})

export async function getSessionFiles(sessionId: string): Promise<[InputFile[], TreeViewElement]> {

  const inputFiles: InputFile[] = []
  const outputFiles: TreeViewElement = {name: "root_generated", children: [], id: "root_generated", isSelectable: true}

  try {
    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token")

    const client = getEdgenSDKClient({ oAuth2PasswordBearer: auth_token })
    const filePaths: string[] = await client.filesListFilesSessionIdGet({ sessionId: parseInt(sessionId) })

    filePaths.forEach(filePath => {

      const parts = filePath.split("/")

      const lastPart = parts[parts.length - 1]

      if (parts[0] === "input") {
        inputFiles.push({ path: filePath, name: lastPart ?? ""})
      } else if(lastPart && (lastPart.startsWith("tmp_code_") || lastPart.includes(" "))){
        return
      }else {
        let current = outputFiles;
  
        parts.forEach((part, index) => {
          if (!current.children) {
              current.children = [];
          }
  
          let child = current.children.find(child => child.name === part);
  
          if (!child) {
              child = {
                  name: part,
                  children: [],
                  id: part,
                  isSelectable: true
              };
              current.children.push(child);
          }
  
          if (index === parts.length - 1) {
              // Last part, it's a file
              child.path = filePath; // Set the full path for files
              delete child.children; // Files do not have children
          }
  
          current = child;
        });
      }
    })
  } catch (error) {
    console.log(error)
  }

  // Organize output files by date
  outputFiles.children?.sort((a, b) => {
    return convertToDate(a.name).getTime() - convertToDate(b.name).getTime()
  }).reverse()

  return [inputFiles, outputFiles]
}

/**
  TODO: if the file is too big, it should be uploaded from the client, currently the solution is to increase the body size limit for server actions but this is not ideal
  especially since we don't know how big the files to submit can get. This should be done after the files layout goes from the same layout as chat history to the one
  inside [chatId]
*/
export async function uploadFile(sessionId: string, file: File) {
  try{
    const auth_token = await getAuthToken()

    if(!auth_token) throw Error("No auth token")

    const client = getEdgenSDKClient({oAuth2PasswordBearer: auth_token})

    await client.filesUploadFilesSessionIdPost({bodyFilesUploadFilesSessionIdPost: {file: file}, sessionId: parseInt(sessionId)})

  }catch(error){
    console.log(error)
  }
}

export async function uploadFiles(sessionId: string, files: PlainFileObject[]) {

  const failedSubmissions: string[] = []
  const successfulSubmissions: string[] = []

  try{
    const revertedFiles: File[] = files.map(file => objectToFile(file))

    for(const file of revertedFiles){
      uploadFile(sessionId, file)
        .then(() => {
          successfulSubmissions.push(file.name)
        })
        .catch((_) => {
          failedSubmissions.push(file.name)
      })
    }

    revalidatePathServer(CHAT_PAGE_PATH)
  }catch(error){
    console.log(error)
  }

  return [successfulSubmissions, failedSubmissions]
}

export async function downloadFile(sessionId: string, path: string) {

  try {
    const auth_token = await getAuthToken()

    if (!auth_token) throw Error("No auth token")

    const response = await fetchSS(`/files/${sessionId}/${path}`, {
      headers: {
        "Authorization": `Bearer ${auth_token}`
      }
    })

    if (!response.ok) throw new Error('Failed to download file')

    const file = await response.blob()

    return  file// Return the file as a Blob

  } catch (error) {
    console.error('Download file error:', error)
    throw error // Rethrow the error to handle it in the calling function
  }
}