'use client'

import { useState, ReactNode } from 'react';
import DialogLayout from "@kit/ui/dialog-layout";
import PDFCompare from './pdf-compare';

export default function PDFViewerDialog({
    inputFile,
    outputFile,
    type,
    externalOpen,
    externalSetOpen,
    trigger,
    title,
    description,
    isInputFileLoading,
    isOutputFileLoading,
    children
}: {
    inputFile: File | null;
    outputFile: File | null;
    type?: string;
    externalOpen: boolean;
    externalSetOpen: (open: boolean) => void;
    trigger: ReactNode;
    title: string;
    description: string;
    isInputFileLoading: boolean;
    isOutputFileLoading: boolean;
    children?: ReactNode;
}) {

    const [isInternalDialogOpen, setIsInternalDialogOpen] = useState(false)

    const isDialogOpen = externalOpen || isInternalDialogOpen
    const setDialogOpen = externalSetOpen || setIsInternalDialogOpen

    return (
        <DialogLayout
            trigger={() => trigger}
            title={title}
            description={description}
            contentClassName="flex flex-col h-[90vh] w-[90vw] max-w-[100rem]"
            onOpen={() => {
                setDialogOpen(true)
            }}
            externalOpen={isDialogOpen}
            externalSetOpen={setDialogOpen}
        >
            {children ? 
                children : 
                <PDFCompare
                    inputFile={inputFile}
                    outputFile={outputFile}
                    type={type}
                    isInputFileLoading={isInputFileLoading}
                    isOutputFileLoading={isOutputFileLoading}
                />
            }
        </DialogLayout>
    );
}