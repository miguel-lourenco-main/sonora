'use client';

import { File, Trash2 } from "lucide-react";
import { Button } from "../shadcn/button";
import TooltipComponent from "./tooltip-component";
import { IconDOC, IconDOCX, IconPDF, IconPPTX } from "./icons";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FILE_SUPPORTED_TYPES } from "@kit/shared/constants";
import { cn } from "../lib";
import { TrackableFile } from "@kit/shared/types";
import { StatusIndicator } from "./file-status-indicator";

interface FilesGridProps {
  files: TrackableFile[];
  onFileRemove?: (filteredFiles: File[]) => void;
  disabled?: boolean;
}

export default function FilesGrid({ 
  files, 
  onFileRemove, 
  disabled,
}: FilesGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation('ui');

    useEffect(() => {
        const updateGridLayout = () => {
            const grid = gridRef.current;
            if (grid) {
                const width = grid.offsetWidth;
                const height = grid.offsetHeight;
                const itemSize = 130;
                const gap = 16;

                const columnCount = Math.floor((width - gap) / (itemSize + gap));
                const rowCount = Math.floor((height - gap) / (itemSize + gap));

                grid.style.setProperty('--grid-column-count', `${columnCount}`);
                grid.style.setProperty('--grid-row-count', `${rowCount}`);
            }
        };

        updateGridLayout();
        window.addEventListener('resize', updateGridLayout);
        return () => window.removeEventListener('resize', updateGridLayout);
    }, []);

    const handleRemoveFile = (index: number) => {
        if (!disabled && onFileRemove) {
            const file = files[index];
            if (file) {
                onFileRemove([file]);
            }
        }
    };

    const getFileIcon = (file: File) => {
        const extensions = FILE_SUPPORTED_TYPES[file.type as keyof typeof FILE_SUPPORTED_TYPES];
        
        if (!extensions?.length) return <File className="size-12" />;
        
        if (extensions.includes(".pdf")) return <IconPDF className="size-12" />;
        if (extensions.includes(".docx")) return <IconDOCX className="size-12" />;
        if (extensions.includes(".doc")) return <IconDOC className="size-12" />;
        if (extensions.includes(".pptx")) return <IconPPTX className="size-12" />;
        
        return <File className="size-12" />;
    };

    return (
        <div 
            ref={gridRef}
            className={cn(
                "grid gap-4 size-full border-2 p-4 rounded-md overflow-hidden",
                disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{
                gridTemplateColumns: 'repeat(var(--grid-column-count, 3), 130px)',
                gridTemplateRows: 'repeat(var(--grid-row-count, 3), 130px)',
                gridAutoRows: '130px',
                gridAutoColumns: '130px',
            }}
        >
            {files.map((file, index) => (
                <div 
                    key={index} 
                    className={cn(
                        "relative overflow-hidden rounded-lg group h-fit w-full flex items-center justify-center",
                        disabled && "pointer-events-none"
                    )}
                >
                    <StatusIndicator 
                        id={file.id} 
                        status={file.uploadingStatus}
                    />
                    <div className="flex flex-col size-full items-center p-2 justify-center space-y-2 object-cover group-hover:opacity-20 transition-opacity">
                        {getFileIcon(file)}
                        <p className="w-full px-2 text-sm text-center truncate">{file.name}</p>
                    </div>
                    {!disabled && (
                        <div className="absolute flex size-full items-center justify-center opacity-0 z-20 group-hover:opacity-100 transition-opacity">
                            <Button 
                                type="button" 
                                variant="light_foreground" 
                                size="fit" 
                                data-delete-file-item 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile(index);
                                }}
                                disabled={disabled}
                            >
                                <TooltipComponent 
                                    trigger={<Trash2 className="size-8 p-1.5" />} 
                                    content={<div>{t('delete')}</div>} 
                                />
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}