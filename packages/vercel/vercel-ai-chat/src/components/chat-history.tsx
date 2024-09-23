import * as React from 'react'


import { SidebarList } from './sidebar-list'
import { I18nComponent } from '@kit/i18n'
import { UIThread } from '../lib/types'
import NewThreadDialog from './new-chat'

export async function ChatHistory({ threads }: { threads: UIThread[] }) {

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium">
        <I18nComponent i18nKey={'vercel:chatHistory'}/>
        </h4>
      </div>
      <div className="mb-2 px-2">
        <NewThreadDialog />
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
        <SidebarList threads={threads} />
      </React.Suspense>
    </div>
  )
}
