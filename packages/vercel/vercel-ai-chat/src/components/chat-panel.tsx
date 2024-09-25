import * as React from 'react'

import { PromptForm } from './prompt-form'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { useUIState } from 'vercel-sdk-core/rsc'
import type { AI } from '../lib/chat/actions'
import { useTranslation } from 'react-i18next'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
}: ChatPanelProps) {
  
  const [messages, setMessages] = useUIState<typeof AI>()

  // TODO: add strings used in exampleMessages
  const { t } = useTranslation("vercel")

  const exampleMessages = [
    {
      heading: t('examples.example_heading_1'),
      subheading: t('examples.example_subheading_1'),
      message: t('examples.example_message_1')
    },
    {
      heading: t('examples.example_heading_2'),
      subheading: t('examples.example_subheading_2'),
      message: t('examples.example_message_2')
    },
    {
      heading: t('examples.example_heading_3'),
      subheading: t('examples.example_subheading_3'),
      message: t('examples.example_message_3')
    },
    {
      heading: t('examples.example_heading_4'),
      subheading: t('examples.example_subheading_4'),
      message: t('examples.example_message_4')
    }
  ]

  //   TODO: Fix example onClick, right now it input the message but it should submit when pressed
  return (
    <div className="relative flex flex-1">
      {/**peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] */}
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
      <div className="mx-auto sm:max-w-3xl w-full sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={ () => {
                  setInput(example.message)
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>
        <div className="space-y-4 border-t px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            input={input}
            setInput={setInput}
            scrollToBottom={scrollToBottom}
          />
        </div>
      </div>
    </div>
  )
}
