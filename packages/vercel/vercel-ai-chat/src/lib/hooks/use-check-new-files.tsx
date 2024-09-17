'use client'

import * as React from 'react'

interface CheckNewFilesContext {
  checkNewFiles: boolean
  setCheckNewFiles: (checkNewFiles: boolean) => void
}

const CheckNewFilesContext = React.createContext<CheckNewFilesContext | undefined>(
  undefined
)

export function useCheckNewFiles() {
  const context = React.useContext(CheckNewFilesContext)
  if (!context) {
    throw new Error('useCheckNewFiles must be used within a CheckNewFilesProvider')
  }
  return context
}

interface CheckNewFilesProviderProps {
  children: React.ReactNode
}

export function CheckNewFilesProvider({ children }: CheckNewFilesProviderProps) {

  // TODO: load existing workflow thorugh cookies
    const [checkNewFiles, setCheckNewFiles] = React.useState(false)

  return (
    <CheckNewFilesContext.Provider
      value={{ checkNewFiles, setCheckNewFiles }}
    >
      {children}
    </CheckNewFilesContext.Provider>
  )
}
