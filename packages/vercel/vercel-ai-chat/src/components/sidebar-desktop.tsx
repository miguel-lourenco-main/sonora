import { Sidebar } from './sidebar'

import { loadThreads } from '../lib/actions'
import { ChatHistory } from "./chat-history";


export async function ChatSidebar() {

  const chats = await loadThreads()

  return (
    <Sidebar className="hidden border-r bg-muted duration-300 ease-in-out lg:flex lg:w-[250px] xl:w-[300px]">
      {/* @ts-ignore */}
      <ChatHistory chats={chats}/>
    </Sidebar>
  )
}
