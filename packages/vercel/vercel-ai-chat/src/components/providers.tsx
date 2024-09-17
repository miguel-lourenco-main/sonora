'use client'

import * as React from 'react'
import { SidebarProvider } from '../lib/hooks/use-sidebar'
import { TooltipProvider } from '@kit/ui/tooltip'
import { WorkflowProvider } from '../lib/hooks/use-workflow'
import { IsRightSidebarOpenProvider } from '../lib/hooks/use-open-files'
import { UserAwareFilesProvider } from '../lib/hooks/use-current-session-files'
import { CheckNewFilesProvider } from '../lib/hooks/use-check-new-files'

export function Providers({ children }: React.PropsWithChildren) {
  return (
      <SidebarProvider>
        <WorkflowProvider>
          <IsRightSidebarOpenProvider>
            <UserAwareFilesProvider>
              <CheckNewFilesProvider>
                {children}
              </CheckNewFilesProvider>
            </UserAwareFilesProvider>
          </IsRightSidebarOpenProvider>
        </WorkflowProvider>
      </SidebarProvider>
  )
}
