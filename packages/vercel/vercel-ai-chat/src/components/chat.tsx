'use client'

import { cn } from '@kit/ui/utils'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { useLocalStorage } from '../lib/hooks/use-local-storage'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useUIState, useAIState } from 'vercel-sdk-core/rsc'
import { InputFile, Message } from '../lib/types'
import { useRouter } from 'next/navigation'
import { useScrollAnchor } from '../lib/hooks/use-scroll-anchor'
import { ScrollArea } from '@kit/ui/scroll-area'
import { I18nComponent } from '@kit/i18n'
import { loadSession } from '../lib/actions'
import { Button } from '@kit/ui/button'
import { File } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@kit/ui/tooltip'
import { ChatRightSidebar } from './chat-right-sidebar'
import { TreeViewElement } from '@kit/ui/tree-view-api'
import { useIsRightSidebarOpen } from '../lib/hooks/use-open-files'
import { FillerComponent } from './filler-component'
import { useUserAwareFiles } from '../lib/hooks/use-current-session-files'
import { useCheckNewFiles } from '../lib/hooks/use-check-new-files'
import { TooltipProvider } from '@radix-ui/react-tooltip'

export interface ChatProps extends React.ComponentProps<'div'> {
  id: string
  subscribedMessages: Message[]
  threadsFiles: [InputFile[], TreeViewElement]
}

export function Chat({ id, className, subscribedMessages, threadsFiles }: ChatProps) {

  const [messages] = useUIState()
  const [aiState] = useAIState()

  useEffect(() => {
    // TODO: Complete when setup is properly done
    aiState.done()
  }, [subscribedMessages])
  
  const router = useRouter()

  const [input, setInput] = useState('')
  const [workflowMenuOpen, setWorkflowMenuOpen] = useState(false)

  const [_, setNewChatId] = useLocalStorage('newChatId', id)

  const { userAwareFiles, setUserAwareFiles, sessionId, setSessionId, value, setValue, hasNewFiles, setHasNewFiles } = useUserAwareFiles()
  const { checkNewFiles, setCheckNewFiles } = useCheckNewFiles()

  const hasNewInputFiles = (userAwareInputFiles: InputFile[], sessionInputFiles: InputFile[]) =>{
    return !arraysEqual(userAwareInputFiles, sessionInputFiles)
  }

  const hasNewGeneratedFiles = (userAwareFiles: TreeViewElement, threadsFiles: TreeViewElement) =>{
    return userAwareFiles.children && threadsFiles.children && !treeViewElementArraysEqual(userAwareFiles.children, threadsFiles.children)
  }

  const checkForNewFiles = (values: string[], userAwareFiles: [InputFile[], TreeViewElement], threadsFiles: [InputFile[], TreeViewElement]) => {
    if(hasNewInputFiles(userAwareFiles[0], threadsFiles[0])){
      values.push('input_files')
    }
    
    if(hasNewGeneratedFiles(userAwareFiles[1], threadsFiles[1])){
      values.push('generated_files')
    }

    return values
  }

  useEffect(() => {

    let values: string[] = []

    let copyCurrentTab = currentTab

    if(id !== sessionId){
      setSessionId(id)

      if(checkNewFiles){
        values = checkForNewFiles(values, userAwareFiles, threadsFiles)
        setCheckNewFiles(false)
      }
      setUserAwareFiles(threadsFiles)
    }else{
      values = checkForNewFiles(values, userAwareFiles, threadsFiles)
    }

    if(values.length > 0 && !values.includes(currentTab)){
      const tab = values[0]

      if(tab) {
        setCurrentTab(tab)
        copyCurrentTab = tab
      }
    }
  
    const remaining = values.filter(tab => tab !== copyCurrentTab)

    if(remaining.length === 0){
      setHasNewFiles(false)
    }else{
      setHasNewFiles(true)
    }

    if(values.length > 0){
      setIsRightSidebarOpen(true)
      setUserAwareFiles(threadsFiles)
      setValue(remaining)
    }

  }, [id, threadsFiles]);

  // Helper function to compare arrays
  function arraysEqual<T>(arr1: any[], arr2: any[]): boolean {
    return arr1.length === arr2.length && arr1.every((item, index) => item.path === arr2[index].path);
  }

  function treeViewElementArraysEqual(arr1: TreeViewElement[], arr2: TreeViewElement[]): boolean {
    if (arr1.length !== arr2.length) return false;
    
    return arr1.every((item, index) => {
      const item2 = arr2[index];

      if(!item2) return false

      return item.id === item2.id &&
            item.name === item2.name &&
            item.path === item2.path &&
            treeViewElementArraysEqual(item.children || [], item2.children || []);
    });
  }

  useEffect(() => {

    setNewChatId(id)
    loadSession(id)

  }, [id])

  const { messagesRef, scrollRef, visibilityRef, scrollToBottom, isVisible } = useScrollAnchor()

  // É preciso dar handle do dropdown proque quando se toma controlo do open e close do select, todas as funcionalidades relacionadas ficam invalidadas
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setWorkflowMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  const { isRightSidebarOpen, setIsRightSidebarOpen, currentTab, setCurrentTab } = useIsRightSidebarOpen()

  const [onHoldFiles, setOnHoldFiles] = useState<File[]>([])

  useEffect(() => {
    if(id === "-1"){
      setOnHoldFiles([])
    }
  }, [id])

  const chatRef = useRef<HTMLDivElement>(null)
  const [chatHeight, setChatHeight] = useState<number | null>(null)

  useEffect(() => {
    if (chatRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.target === chatRef.current) {
            setChatHeight(entry.contentRect.height)
          }
        }
      })

      resizeObserver.observe(chatRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [])
  
  return (
    <div ref={chatRef} className='flex flex-row relative size-full group'>
      <div className="absolute top-5 right-4 z-20">
        <div className='relative'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='w-fit'>
                <Button size={'chatFiles'} shape={'circle'} variant={'background'} className="mr-2.5" onClick={() => {
                  if(value.includes(currentTab)){
                    const filtered = value.filter(tab => tab !== currentTab)
                    setValue(filtered)

                    if(filtered.length === 0) setHasNewFiles(false)
                  }
                  setUserAwareFiles(threadsFiles)
                  setIsRightSidebarOpen(!isRightSidebarOpen)
                }}>
                  <File size={18}/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <I18nComponent i18nKey="vercel:session_files" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          { hasNewFiles && (
            <div className='absolute bottom-6 right-2 rounded-full bg-red-500 w-2 h-2'/>
          )}
          <div 
            className="absolute top-12 right-4" 
            style={{
              height: chatHeight ? `calc(${chatHeight}px - 12rem)` : '',
              transition: 'height 0.3s ease-in-out'
            }}          >
            <ChatRightSidebar threadsFiles={threadsFiles} onHoldFiles={onHoldFiles} setOnHoldFiles={setOnHoldFiles} id={id}/>
          </div>
        </div>
      </div>
      <div className="w-full h-full relative flex flex-col justify-between">
        <ScrollArea className="" ref={scrollRef}>
          <div className={cn('pb-[200px] pt-24', className)} ref={messagesRef}>
            {messages.length ? (
              <ChatList messages={messages} isShared={false} />
            ) : (
              <></>
            )}
            <div className="w-full h-px" ref={visibilityRef} />
          </div>
        </ScrollArea>
        <div className='flex'>
          <ChatPanel
            id={id}
            input={input}
            setInput={setInput}
            isAtBottom={isVisible}
            scrollToBottom={scrollToBottom}
            onHoldFiles={onHoldFiles}
            setOnHoldFiles={setOnHoldFiles}
          />
          <FillerComponent />
        </div>
      </div>
    </div>
  )
}
