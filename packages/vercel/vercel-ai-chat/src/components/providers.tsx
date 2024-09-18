'use client'

import * as React from 'react'
import { SidebarProvider } from '../lib/hooks/use-sidebar'


export function Providers({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}
