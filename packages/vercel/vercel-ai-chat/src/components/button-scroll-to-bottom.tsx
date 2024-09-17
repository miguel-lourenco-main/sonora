'use client'

import * as React from 'react'

import { cn } from '@kit/ui/utils'
import { Button, type ButtonProps } from '@kit/ui/button'
import { IconArrowDown } from '@kit/ui/icons'
import { I18nComponent } from '@kit/i18n'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@kit/ui/tooltip'

interface ButtonScrollToBottomProps extends ButtonProps {
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ButtonScrollToBottom({
  className,
  isAtBottom,
  scrollToBottom,
  ...props
}: ButtonScrollToBottomProps) {
  return (
    <div 
      className={cn(
        'absolute right-4 top-1 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className='w-fit'>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollToBottom()}
              {...props}
            >
              <IconArrowDown />
              <span className="sr-only">
                <I18nComponent i18nKey={'vercel:scrollToBottom'}/>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <I18nComponent i18nKey="vercel:scrollToBottom" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
