'use client'

import { Trans } from 'react-i18next'

export function I18nComponent({
    i18nKey,
    className
}: {
    i18nKey: string
    className?: string
}) {

  return <Trans i18nKey={i18nKey} className={className}/>
}