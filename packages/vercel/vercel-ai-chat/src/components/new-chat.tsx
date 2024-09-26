'use client'

import { Button } from '@kit/ui/button'
import { IconPlus } from '@kit/ui/icons'
import { I18nComponent } from '@kit/i18n'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import DialogLayout from '@kit/ui/dialog-layout';
import TooltipComponent from '@kit/ui/tooltip-component';
import MultiSelectCollections from './multi-select-collections'
import { useForm, Controller } from "react-hook-form";
import { createThreadFormSchema } from '../lib/schemas/create-thread'
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateThreadFormData } from '../lib/types'
import { Input } from '@kit/ui/input'
import { createThread } from '../lib/actions'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@kit/ui/tooltip'
import { Label } from '@kit/ui/label'
import { DEFAULT_THREAD_NAME } from '../lib/constants'

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
  const { t } = useTranslation('vercel')

  // TODO: get default name from by getting a list of all threads and adding 1 to the highest number
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<CreateThreadFormData>({
    resolver: zodResolver(createThreadFormSchema),
    defaultValues: {
      name: DEFAULT_THREAD_NAME,
      collections: [],
    },
  })

  const resetForm = () => {
    setValue('name',  DEFAULT_THREAD_NAME)
    setValue('collections', [])
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
        resetForm()
      }}
      title={t('create_thread')}
      contentClassName="w-[80%] lg:w-[40%] max-h-[90%] flex flex-col"
    >
      <form 
        onSubmit={handleSubmit(async (data) => {

          const value = data.name.trim()
          if (!value) return

          // Submit files and then create thread
          await createThread(value)
          resetForm()
          setOpen(false)

        })} 
        className="flex flex-col items-start justify-center w-full h-fit gap-y-4"
      >
        <div className="relative mb-3">          
          <Label className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900">
            {t('name')}
          </Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                className="block h-10 w-full rounded-md border-0 pt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value)
                }} 
              />
            )}
          />
        </div>
        <div className="flex flex-col w-full items-start justify-center gap-y-2">
          <Label>{t('collections')}</Label>
          <p className="text-sm text-gray-500 ml-1">{t('knowledge_bases_description')}</p>
          <Controller
            control={control}
            name="collections"
            render={({ field }) => (
              <MultiSelectCollections
                className="w-full justify-end"
                collections={field.value}
                onChange={(value) => {
                  field.onChange(value)
                }} 
              />
            )}
          />
        </div>
        <div className="flex w-full justify-end">
          <Button
            type="submit"
          >
            {t('create')}
          </Button>
        </div>
      </form>
    </DialogLayout>
  )
}