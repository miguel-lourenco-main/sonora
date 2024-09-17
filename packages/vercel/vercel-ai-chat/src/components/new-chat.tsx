'use client'

import Link from 'next/link'
import { cn } from '@kit/ui/utils'
import { buttonVariants } from '@kit/ui/button'
import { IconPlus } from '@kit/ui/icons'
import { I18nComponent } from '@kit/i18n'
import { CHAT_PAGE_PATH } from '@kit/shared/constants'

export function NewChat() {


    return(
        <Link
          href={CHAT_PAGE_PATH}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
          )}
        >
          <IconPlus className="-translate-x-2 stroke-2" />
          <I18nComponent i18nKey={'vercel:newChat'}/>
        </Link>
    )
}