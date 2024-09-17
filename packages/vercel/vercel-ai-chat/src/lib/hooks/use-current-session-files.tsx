'use client'

import * as React from 'react'
import { InputFile } from '../types'
import { TreeViewElement } from '@kit/ui/tree-view-api'
import { DEFAULT_FILE_TREE } from '@kit/shared/constants'

interface UserAwareFilesContext {
  userAwareFiles: [InputFile[], TreeViewElement]
  setUserAwareFiles: (userAwareFiles: [InputFile[], TreeViewElement]) => void,
  sessionId: string
  setSessionId: (sessionId: string) => void
  hasNewFiles: boolean
  setHasNewFiles: (hasNewFiles: boolean) => void
  value:string[]
  setValue: React.Dispatch<React.SetStateAction<string[]>>
}

const UserAwareFilesContext = React.createContext<UserAwareFilesContext | undefined>(
  undefined
)

export function useUserAwareFiles() {
  const context = React.useContext(UserAwareFilesContext)
  if (!context) {
    throw new Error('useUserAwareFiles must be used within a UserAwareFilesProvider')
  }
  return context
}

interface UserAwareFilesProviderProps {
  children: React.ReactNode
}

export function UserAwareFilesProvider({ children }: UserAwareFilesProviderProps) {

  // TODO: load existing workflow thorugh cookies

  const [userAwareFiles, setUserAwareFiles] = React.useState<[InputFile[], TreeViewElement]>([[], DEFAULT_FILE_TREE])
  const [sessionId, setSessionId] = React.useState('')
  const [hasNewFiles, setHasNewFiles] = React.useState(false)
  const [value, setValue] = React.useState<string[]>([])

  return (
    <UserAwareFilesContext.Provider
      value={{ userAwareFiles, setUserAwareFiles, sessionId, setSessionId, hasNewFiles, setHasNewFiles, value, setValue }}
    >
      {children}
    </UserAwareFilesContext.Provider>
  )
}
