import * as React from 'react'


import { SidebarList } from './sidebar-list'
import { I18nComponent } from '@kit/i18n'
import { Chat } from '../lib/types'
import { NewChat } from './new-chat'

export async function ChatHistory({ chats }: { chats: Chat[] }) {

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium">
        <I18nComponent i18nKey={'vercel:chatHistory'}/>
        </h4>
      </div>
      <div className="mb-2 px-2">
        <NewChat />
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        {/* @ts-ignore */}
        <SidebarList chats={chats} />
      </React.Suspense>
    </div>
  )
}
