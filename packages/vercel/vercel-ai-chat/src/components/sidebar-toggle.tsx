'use client'

import * as React from 'react'

import { useSidebar } from '../lib/hooks/use-sidebar'
import { Button } from '@kit/ui/button'
import { IconSidebar } from '@kit/ui/icons'
import { I18nComponent } from '@kit/i18n'

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      className="-ml-2 hidden size-9 p-0 lg:flex"
      onClick={() => {
        toggleSidebar()
      }}
    >
      <IconSidebar className="size-6" />
      <span className="sr-only">
        <I18nComponent i18nKey="vercel:toggle-sidebar"/>
      </span>
    </Button>
  )
}
