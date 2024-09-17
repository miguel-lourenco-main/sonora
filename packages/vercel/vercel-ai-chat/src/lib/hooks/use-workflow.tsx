'use client'

import * as React from 'react'

interface WorkflowContext {
  selectedWorkflowId: number
  setSelectedWorkflowId: (selectedWorkflowId: number) => void
}

const WorkflowContext = React.createContext<WorkflowContext | undefined>(
  undefined
)

export function useWorkflow() {
  const context = React.useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}

interface WorkflowProviderProps {
  children: React.ReactNode
}

export function WorkflowProvider({ children }: WorkflowProviderProps) {

  // TODO: load existing workflow thorugh cookies

  const [selectedWorkflowId, setSelectedWorkflowId] = React.useState(-1)

  return (
    <WorkflowContext.Provider
      value={{ selectedWorkflowId, setSelectedWorkflowId }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}
