'use client'

import * as React from 'react'

interface IsRightSidebarOpenContext {
  isRightSidebarOpen: boolean
  setIsRightSidebarOpen: (isRightSidebarOpen: boolean) => void
  currentTab: string
  setCurrentTab: (currentTab: string) => void
}

const IsRightSidebarOpenContext = React.createContext<IsRightSidebarOpenContext | undefined>(
  undefined
)

export function useIsRightSidebarOpen() {
  const context = React.useContext(IsRightSidebarOpenContext)
  if (!context) {
    throw new Error('useIsRightSidebarOpen must be used within a IsRightSidebarOpenProvider')
  }
  return context
}

interface IsRightSidebarOpenProviderProps {
  children: React.ReactNode
}

export function IsRightSidebarOpenProvider({ children }: IsRightSidebarOpenProviderProps) {

  // TODO: load existing workflow thorugh cookies

  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState('input_files')

  return (
    <IsRightSidebarOpenContext.Provider
      value={{ isRightSidebarOpen, setIsRightSidebarOpen, currentTab, setCurrentTab }}
    >
      {children}
    </IsRightSidebarOpenContext.Provider>
  )
}
