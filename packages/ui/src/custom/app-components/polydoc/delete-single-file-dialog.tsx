'use client'

import React from 'react';

import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from '../../../shadcn/alert-dialog';
import { DeleteDialogLayout } from '../../repo-components/dialogs/alert-dialog-layout';
import { useTranslation } from 'react-i18next';


export default function DeleteSingleFileDialog({
    deleteFunc,
}:{
    deleteFunc: () => void
}) {

    const { t } = useTranslation('ui')

    const trigger = () => {
        return(
            <div className='p-2 text-sm hover:bg-muted'>
                {t("delete")}
            </div>
        )
    }

    const title = "Are you sure you want to continue?"
    const description = "This action will remove files from the workspace"

    const footer = () => {
        return(
            <AlertDialogFooter>
                <AlertDialogCancel 
                >
                    {t("cancel")}
                </AlertDialogCancel>
                <AlertDialogAction 
                    onClick={() => {
                        deleteFunc()
                    }}
                >
                    {t("continue")}
                </AlertDialogAction>
            </AlertDialogFooter>
        )
    }

    return (
        <DeleteDialogLayout reset={() => {}} trigger={trigger} title={title} description={description} footer={footer}/>
    );
}