'use client';

import { File, FileUp, RotateCw, Trash2, X } from "lucide-react";
import { Button } from "../shadcn/button";
import TooltipComponent from "./tooltip-component";
import {IconDOC, IconDOCX, IconPDF } from "./icons";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface FilesGridProps {
  files: File[];
  onFileRemove?: (index: number) => void;  // Add this new prop
}

export default function FilesGrid({ files, onFileRemove }: FilesGridProps) {
    
    const gridRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation('ui');

    useEffect(() => {
        const updateGridColumns = () => {
            const grid = gridRef.current;

            if (grid) {
                const width = grid.offsetWidth;
                const columnCount = Math.floor(width / 120); // 120px is the minimum width for each item

                grid.style.setProperty('--grid-column-count', `${columnCount}`);
            }
        };

        updateGridColumns();
        
        window.addEventListener('resize', updateGridColumns);
        return () => window.removeEventListener('resize', updateGridColumns);
    }, []);

    const handleRemoveFile = (index: number) => {
        onFileRemove && onFileRemove(index)
    };

    return (
        <div 
            ref={gridRef}
            className="grid gap-4 size-full border-2 p-3 rounded-md"
            style={{
                gridTemplateColumns: 'repeat(var(--grid-column-count, 3), minmax(100px, 1fr))'
            }}
        >
            {files.map((file, index) => {

                const extension = file.type.split("/")[1]
                let icon: React.ReactNode

                if (extension === "pdf") {
                    icon = <IconPDF className="size-12" />;
                } else if (extension === "vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    icon = <IconDOCX className="size-12" />;
                } else if (extension === "doc" || extension === "msword") {
                    icon = <IconDOC className="size-12" />;
                } else {
                    icon = <File className="size-12" />;
                }

                return (
                    <div key={index} className="relative overflow-hidden rounded-lg group size-fit m-2">
                        <div className="flex flex-col items-center justify-center size-24 space-y-2 object-cover group-hover:opacity-20 transition-opacity">
                            {icon}
                            <p className="w-full px-2 text-sm text-center truncate">{file.name}</p>
                        </div>
                        <div className="absolute inset-0 flex size-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button type="button" variant="light_foreground" size="fit" onClick={() => handleRemoveFile(index)}>
                                <TooltipComponent trigger={<Trash2 className="size-8 p-1.5" />} content={<div>{t('delete')}</div>} />
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

//TODO: remove this
type FileWithStatus = {
    file: File
    status: "pending" | "succeded" | "failed"
  }

export function FilesGridWStatus({ files, removeFiles}: { files: FileWithStatus[], removeFiles: (files: File[]) => void }) {
    
    const gridRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation('ui');

    useEffect(() => {
        const updateGridColumns = () => {
            const grid = gridRef.current;

            if (grid) {
                const width = grid.offsetWidth;
                const columnCount = Math.floor(width / 120); // 120px is the minimum width for each item

                grid.style.setProperty('--grid-column-count', `${columnCount}`);
            }
        };

        updateGridColumns();
        
        window.addEventListener('resize', updateGridColumns);
        return () => window.removeEventListener('resize', updateGridColumns);
    }, []);

    return (
        <div 
            ref={gridRef}
            className="grid gap-4 size-full border-2 p-3 rounded-md"
            style={{
                gridTemplateColumns: 'repeat(var(--grid-column-count, 3), minmax(100px, 1fr))'
            }}
        >
            {files.map((file, index) => {

                const extension = file.file.type.split("/")[1]
                let icon: React.ReactNode

                if (extension === "pdf") {
                    icon = <IconPDF className="size-12" />;
                } else if (extension === "vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    icon = <IconDOCX className="size-12" />;
                } else if (extension === "doc" || extension === "msword") {
                    icon = <IconDOC className="size-12" />;
                } else {
                    icon = <File className="size-12" />;
                }

                return (
                    <div key={index} className="relative overflow-hidden rounded-lg group size-fit m-2">
                        <div className="flex flex-col items-center justify-center size-28 space-y-2 object-cover group-hover:opacity-20 transition-opacity">
                            <div className="relative flex size-fit">
                                {icon}
                                {file.status === "succeded" && (
                                    <div className="absolute -top-3 -right-6 size-fit rounded-full border border-green-500 stroke-green-500">
                                        <FileUp className="size-5 p-1 stroke-green-500" />
                                    </div>
                                )}
                                {file.status === "failed" && (
                                    <div className="absolute -top-3 -right-6 size-fit rounded-full border border-red-500 stroke-red-500">
                                        <X className="size-5 p-0.5 stroke-red-500" />
                                    </div>
                                )}
                                {/**
                                 * <div className="absolute -top-3 -right-6 size-4 rounded-full border bg-green-500"/>
                                 */}
                            </div>    
                            <p className="w-full px-2 text-sm text-center truncate">{file.file.name}</p>
                        </div>
                        <div className="absolute inset-0 flex size-full items-center justify-center gap-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {file.status === "failed" && (
                                <Button variant="light_foreground" size="fit" onClick={() => {
                                    removeFiles([file.file])
                                }}>
                                    <TooltipComponent trigger={<RotateCw className="size-8 p-1.5" />} content={<div>{t('retry')}</div>} />
                                </Button>
                            )}
                            {file.status === "pending" && (
                                <Button variant="light_foreground" size="fit" onClick={() => {
                                    removeFiles([file.file])
                                }}>
                                    <TooltipComponent trigger={<FileUp className="size-8 p-1.5" />} content={<div>{t('upload')}</div>} />
                                </Button>
                            )}
                            <Button variant="light_foreground" size="fit" 
                                onClick={() => {
                                    removeFiles([file.file])
                                }}
                            >
                                <TooltipComponent trigger={<Trash2 className="size-8 p-1.5" />} content={<div>{t('delete')}</div>} />
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}