import { I18nComponent } from '@kit/i18n'
import { clearChats } from '../lib/actions'
import { ClearHistory } from './clear-history'
import { SidebarItems } from './sidebar-items'
import { Chat } from '../lib/types'

interface SidebarListProps {
  auth_token?: string,
  chats: Chat[]
  children?: React.ReactNode
}

export async function SidebarList({ auth_token, chats }: SidebarListProps) {

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              <I18nComponent i18nKey={'vercel:noChatHistory'}/>
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-end p-4">
        {/** <ThemeToggle /> */}
        <ClearHistory
          auth_token={auth_token}
          clearChats={clearChats}
          isEnabled={chats?.length > 0}
        />
      </div>
    </div>
  )
}
