'use client'

import { useEffect, useRef, UIEvent, useState, useCallback } from 'react';
import LoadingDocument from "@kit/ui/loading-pdf";
import { useTranslation } from 'react-i18next';
import { FileIcon } from 'lucide-react';
import { cn } from '@kit/ui/utils';
import dynamic from 'next/dynamic';
import { Card } from '@kit/ui/card';
import { TabData } from '@kit/shared/types';

const PDFViewer = dynamic(() => import('@kit/ui/pdf-viewer'), { ssr: false });

export function renderPDFView(
    file: File | null, 
    isLoading: boolean,
    isRendered: boolean, 
    index: number, 
    type?: string,
    setIsRendered?: (b: boolean) => void,
    handleScroll?: (index: number) => (e: UIEvent<HTMLDivElement>) => void, 
    scrollRefs?: React.RefObject<HTMLDivElement>[]
) {
    const { t } = useTranslation("custom");
    const onScroll = handleScroll ? handleScroll(index) : undefined;
    const ref = scrollRefs && scrollRefs[index] ? scrollRefs[index] : undefined;

    return (
        <div 
            key={index}
            className="size-full justify-center items-center overflow-hidden border-muted border rounded-md"
        >
            {!file && !isLoading && (
                <div className="size-full flex items-center justify-center">
                    {t('noFileCurrentlyAvailable')}
                </div>
            )}
            {(isLoading || (!isRendered && file)) && <LoadingDocument />}
            {file && (
                <div className={cn("h-full w-full", isRendered ? "flex" : "hidden")}>
                    <PDFViewer 
                        pdf={file}
                        setIsRendered={setIsRendered}
                        onScroll={onScroll} 
                        scrollRef={ref} 
                        filter={undefined}
                        type={type}
                    />
                </div>
            )}
        </div>
    );
}

type FileState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  file: File | null;
};

export default function PDFCompare({
    inputFile,
    outputFile,
    isInputFileLoading,
    isOutputFileLoading,
    currentTab,
    type,
}: {
    inputFile: File | null;
    outputFile: File | null;
    isInputFileLoading: boolean;
    isOutputFileLoading: boolean;
    currentTab?: TabData;
    type?: string;
}) {
    const [inputFileState, setInputFileState] = useState<FileState>({ 
        status: isInputFileLoading ? 'loading' : 'idle', 
        file: inputFile 
    });
    const [outputFileState, setOutputFileState] = useState<FileState>({ 
        status: isOutputFileLoading ? 'loading' : 'idle', 
        file: outputFile 
    });
    const [inputFileRendered, setInputFileRendered] = useState(false);
    const [outputFileRendered, setOutputFileRendered] = useState(false);
    const scrollRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
    
    useEffect(() => {
        setInputFileState({
            status: isInputFileLoading ? 'loading' : inputFile ? 'success' : 'idle',
            file: inputFile
        });
        setOutputFileState({
            status: isOutputFileLoading ? 'loading' : outputFile ? 'success' : 'idle',
            file: outputFile
        });
    }, [inputFile, outputFile, isInputFileLoading, isOutputFileLoading]);

    const handleScroll = useCallback((index: number) => (e: UIEvent<HTMLDivElement>) => {
        const otherIndex = 1 - index;
        if (scrollRefs[otherIndex]?.current) {
            scrollRefs[otherIndex]!.current!.scrollTop = e.currentTarget.scrollTop;
        }
    }, []);

    return (
        <div className="flex flex-col size-full overflow-hidden">
            <div className="grid md:grid-cols-2 gap-4 h-full min-h-0">
                <Card className="flex flex-col min-h-0 p-4">
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        {currentTab?.icon ?? <FileIcon className="size-4" />}
                        <span>{currentTab?.exampleFiles?.original?.name ?? currentTab?.file}</span>
                    </div>
                    <div className={cn("size-full min-h-0 rounded-lg border bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center", !inputFileRendered && "flex-1")}>
                        {renderPDFView(
                            inputFileState.file,
                            inputFileState.status === 'loading',
                            inputFileRendered,
                            0,
                            type,
                            setInputFileRendered,
                            handleScroll,
                            scrollRefs as React.RefObject<HTMLDivElement>[]
                        )}
                    </div>
                </Card>
                <Card className="flex flex-col min-h-0 p-4">
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        {currentTab?.icon ?? <FileIcon className="size-4" />}
                        <span>{currentTab?.exampleFiles?.translated?.name ?? currentTab?.file}</span>
                    </div>
                    <div className={cn("size-full min-h-0 rounded-lg border bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center", !outputFileRendered && "flex-1")}>
                        {renderPDFView(
                            outputFileState.file,
                            outputFileState.status === 'loading',
                            outputFileRendered,
                            1,
                            type,
                            setOutputFileRendered,
                            handleScroll,
                            scrollRefs as React.RefObject<HTMLDivElement>[]
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}