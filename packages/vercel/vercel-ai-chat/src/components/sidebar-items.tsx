'use client'

import { UIThread } from '../lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { deleteThread } from '../lib/actions'

import { SidebarActions } from './sidebar-actions'
import { SidebarItem } from './sidebar-item'

interface SidebarItemsProps {
  threads?: UIThread[]
}

export function SidebarItems({ threads }: SidebarItemsProps) {
  if (!threads?.length) return null

  return (
    <AnimatePresence>
      {threads.map(
        (thread, index) =>
          thread && (
            <motion.div
              key={thread?.id}
              exit={{
                opacity: 0,
                height: 0
              }}
            >
              <SidebarItem index={index} thread={thread}>
                <SidebarActions thread={thread} removeThread={({id, path}) => deleteThread(id, path)} />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  )
}
