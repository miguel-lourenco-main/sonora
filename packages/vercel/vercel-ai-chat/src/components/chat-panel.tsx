import * as React from 'react'

import { Button } from '@kit/ui/button'
import { PromptForm } from './prompt-form'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { IconShare } from '@kit/ui/icons'
import { useUIState } from '@kit/vercel-sdk-core/rsc'
import type { AI } from '../lib/chat/actions'
import { I18nComponent } from '@kit/i18n';

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  onHoldFiles: File[],
  setOnHoldFiles: (files: File[]) => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  onHoldFiles,
  setOnHoldFiles
}: ChatPanelProps) {
  
  const [messages, setMessages] = useUIState<typeof AI>()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  /**
  const { submitUserMessage } = useActions()

  const { selectedWorkflowId } = useWorkflow()

  const { t } = useTranslation()

  const router = useRouter()
  const pathname = usePathname()

  const exampleMessages = [
    {
      heading: 'What are the',
      subheading: 'trending memecoins today?',
      message: `What are the trending memecoins today?`
    },
    {
      heading: 'What is the price of',
      subheading: '$DOGE right now?',
      message: 'What is the price of $DOGE right now?'
    },
    {
      heading: 'I would like to buy',
      subheading: '42 $DOGE',
      message: `I would like to buy 42 $DOGE`
    },
    {
      heading: 'What are some',
      subheading: `recent events about $DOGE?`,
      message: `What are some recent events about $DOGE?`
    }
  ]
   */

  return (
    <div className="relative flex flex-1">
      {/**peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] */}
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
      

      <div className="mx-auto sm:max-w-3xl w-full sm:px-4">
        {/**
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  processSubmitMessage(setMessages, example.message, submitUserMessage, selectedWorkflowId, router, pathname, t, scrollToBottom)
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>
         */}

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    <I18nComponent i18nKey={'vercel:share'}/>
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 border-t px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            input={input}
            setInput={setInput}
            scrollToBottom={scrollToBottom}
            onHoldFiles={onHoldFiles}
            setOnHoldFiles={setOnHoldFiles}
          />
        </div>
      </div>
    </div>
  )
}
