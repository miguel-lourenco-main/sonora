'use client';

import { File, Trash2 } from "lucide-react";
import { Button } from "../shadcn/button";
import TooltipComponent from "./tooltip-component";
import {IconDOC, IconDOCX, IconPDF } from "./icons";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function FilesGrid({ files, setFiles }: { files: File[], setFiles: Dispatch<SetStateAction<File[]>> }) {
    
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
            className="grid gap-4 size-full border-2 p-5 rounded-md"
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
                    <div key={index} className="relative overflow-hidden rounded-lg group size-fit m-2 p-2 bg-muted/50">
                        <div className="flex flex-col items-center justify-center size-24 space-y-2 object-cover group-hover:opacity-20 transition-opacity">
                            {icon}
                            <p className="w-full px-2 text-sm truncate">{file.name}</p>
                        </div>
                        <div className="absolute inset-0 flex size-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="light_foreground" size="fit" onClick={() => setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))}>
                                <TooltipComponent trigger={<Trash2 className="size-full p-2" />} content={<div>{t('delete')}</div>} />
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}