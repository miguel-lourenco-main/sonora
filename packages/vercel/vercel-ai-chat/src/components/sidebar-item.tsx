'use client'

import * as React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { motion } from 'framer-motion'

import { buttonVariants } from '@kit/ui/button'
import { IconMessage, IconUsers } from '@kit/ui/icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@kit/ui/tooltip'
import useLocalStorage from '../lib/hooks/use-local-storage'
import { type UIThread } from '../lib/types'
import { cn } from '@kit/ui/utils'
import { I18nComponent } from '@kit/i18n'

interface SidebarItemProps {
  index: number
  thread: UIThread
  children: React.ReactNode
}

export function SidebarItem({ index, thread, children }: SidebarItemProps) {
  const pathname = usePathname()

  const isActive = pathname === thread.path
  const [newThreadId, setNewThreadId] = useLocalStorage('newThreadId', null)
  const shouldAnimate = index === 0 && isActive && newThreadId

  if (!thread?.id) return null

  return (
    <motion.div
      className="relative h-8"
      variants={{
        initial: {
          height: 0,
          opacity: 0
        },
        animate: {
          height: 'auto',
          opacity: 1
        }
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn'
      }}
    >
      <div className="absolute left-2 top-1 flex size-6 items-center justify-center">
        {thread.sharePath ? (
          <TooltipProvider>
            <Tooltip delayDuration={1000}>
              <TooltipTrigger
                tabIndex={-1}
              className="focus:bg-muted focus:ring-1 focus:ring-ring"
            >
              <IconUsers className="mr-2 mt-1 text-zinc-500" />
            </TooltipTrigger>
            <TooltipContent>
              <I18nComponent i18nKey={'vercel:sharedChat'}/>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <IconMessage className="mr-2 mt-1 text-zinc-500" />
        )}
      </div>
      <Link
        href={thread.path}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10',
          isActive && 'bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800'
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={thread.title}
        >
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              thread.title.split('').map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100
                    },
                    animate: {
                      opacity: 1,
                      x: 0
                    }
                  }}
                  initial={shouldAnimate ? 'initial' : undefined}
                  animate={shouldAnimate ? 'animate' : undefined}
                  transition={{
                    duration: 0.25,
                    ease: 'easeIn',
                    delay: index * 0.05,
                    staggerChildren: 0.05
                  }}
                  onAnimationComplete={() => {
                    if (index === thread.title.length - 1) {
                      setNewThreadId(null)
                    }
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{thread.title}</span>
            )}
          </span>
        </div>
      </Link>
      {isActive && <div className="absolute right-2 top-1">{children}</div>}
    </motion.div>
  )
}
