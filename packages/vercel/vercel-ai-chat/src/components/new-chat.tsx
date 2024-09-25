'use client'

import { Button } from '@kit/ui/button'
import { IconPlus } from '@kit/ui/icons'
import { I18nComponent } from '@kit/i18n'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import DialogLayout from '@kit/ui/dialog-layout';
import TooltipComponent from '@kit/ui/tooltip-component';
import MultiSelectKbs from './multi-select-kbs'
import { useForm, Controller } from "react-hook-form";
import { createThreadFormSchema } from '../lib/schemas/create-thread'
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateThreadFormData } from '../lib/types'
import { Input } from '@kit/ui/input'
import { createThread } from '../lib/actions'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@kit/ui/tooltip'

/**
 * export default function NewThreadDialog() {

  const [open, setOpen] = useState(false)

  const { t } = useTranslation('custom')

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<CreateThreadFormData>({
    resolver: zodResolver(createThreadFormSchema),
    defaultValues: {
      knowledge_bases: [],
    },
  })

  const resetForm = () => {
    setValue('knowledge_bases', [])
  }

  return (
    <DialogLayout
      externalOpen={open}
      externalSetOpen={setOpen}
      trigger={ () => 
        <TooltipComponent 
          trigger={
            <Button
              onClick={() => {
                setOpen(true)
              }}
              variant={'outline'}
              className={'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10' }
            >
              <IconPlus className="-translate-x-2 stroke-2" />
              <I18nComponent i18nKey={'vercel:newChat'}/>
            </Button>
          } 
          content={<div>{t('create_thread')}</div>} 
        />
      }
      reset={() => {
        resetForm()
      }}
      footer={() => (
        <div className="flex justify-end">
          <Button
            type="submit"
            onClick={() => {
              setOpen(false)
              resetForm()
            }}
          >
            {t('create')}
          </Button>
        </div>
      )}
      title={t('create_thread')}
      description={t('create_thread_description')}
      contentClassName="w-[40%] max-h-[26%] flex flex-col"
    >
      <div className="flex items-center justify-center =w-full h-fit">
        <Controller
          control={control}
          name="knowledge_bases"
          render={({ field }) => (
            <MultiSelectKbs
              className="w-[26rem] justify-end"
              knowledgeBases={field.value}
              onChange={(value) => {
                field.onChange(value)
              }} 
            />
          )}
        />
      </div>
    </DialogLayout>
  )
}
*/

export function NewThreadChatPrompt() {

  const [ open, setOpen ] = useState(false)
  
  return (
    <NewThreadDialog
      trigger={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] flex lg:hidden size-8 rounded-full bg-background p-0 sm:left-4"
            >
              <IconPlus />
              <span className="sr-only">
                <I18nComponent i18nKey={'vercel:newChat'}/>
              </span>
            </Button>
          </TooltipTrigger>
            <TooltipContent>
              <I18nComponent i18nKey={'vercel:newChat'}/>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      open={open}
      setOpen={setOpen}
    />
  )
}

export function NewThreadTopLeft() {

  const [ open, setOpen ] = useState(false)
  
  return (
    <NewThreadDialog
      trigger={
        <Button
          onClick={() => {
            setOpen(true)
          }}
          variant={'outline'}
          className={'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10' }
        >
          <IconPlus className="-translate-x-2 stroke-2" />
          <I18nComponent i18nKey={'vercel:newChat'}/>
        </Button>
      }
      open={open}
      setOpen={setOpen}
    />
  )
}

function NewThreadDialog({
  trigger,
  open,
  setOpen,
}: {
  trigger: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { t } = useTranslation('custom')

  const defaultName = "Default_Session"

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<CreateThreadFormData>({
    resolver: zodResolver(createThreadFormSchema),
    defaultValues: {
      name: defaultName,
    },
  })

  const resetForm = () => {
    setValue('name', defaultName)
  }


  // TODO: create dialog layouts that support 1 or multiple forms
  
  return (
    <DialogLayout
      externalOpen={open}
      externalSetOpen={setOpen}
      trigger={ () => 
        <TooltipComponent 
          trigger={
            trigger
          } 
          content={<div>{t('create_thread')}</div>} 
        />
      }
      reset={() => {
      }}
      footer={() => (
        <></>
      )}
      title={t('create_thread')}
      description={t('create_thread_description')}
      contentClassName="w-[80%] lg:w-[40%] max-h-[26%] flex flex-col"
    >
      <form 
        onSubmit={handleSubmit(async (data) => {

          const value = data.name.trim()
          if (!value) return

          // Optimistically add user message UI
          await createThread(value)
          resetForm()
        })} 
        className="flex flex-col items-center justify-center w-full h-fit"
      >
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              className="w-[26rem] justify-end"
              value={field.value}
              onChange={(value) => {
                field.onChange(value)
              }} 
            />
          )}
        />
        <div className="flex w-full justify-end">
          <Button
            type="submit"
            onClick={() => {
              setOpen(false)
            }}
          >
            {t('create')}
          </Button>
        </div>
      </form>
    </DialogLayout>
  )
}