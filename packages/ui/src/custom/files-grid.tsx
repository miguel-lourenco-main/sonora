'use client';

import { File, Trash2 } from "lucide-react";
import { Button } from "../shadcn/button";
import TooltipComponent from "./tooltip-component";
import { IconDOC, IconDOCX, IconPDF } from "./icons";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface FilesGridProps {
  files: File[];
  onFileRemove?: (index: number) => void;
}

export default function FilesGrid({ files, onFileRemove }: FilesGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation('ui');

    useEffect(() => {
        const updateGridLayout = () => {
            const grid = gridRef.current;
            if (grid) {
                const width = grid.offsetWidth; // Subtracting padding (24px on each side)
                const height = grid.offsetHeight; // Subtracting padding (24px on each side)
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
        onFileRemove && onFileRemove(index);
    };

    return (
        <div 
            ref={gridRef}
            className="grid gap-4 size-full border-2 p-4 rounded-md overflow-auto"
            style={{
                gridTemplateColumns: 'repeat(var(--grid-column-count, 3), 130px)',
                gridTemplateRows: 'repeat(var(--grid-row-count, 3), 130px)',
                gridAutoRows: '130px',
                gridAutoColumns: '130px',
            }}
        >
            {files.map((file, index) => {
                const extension = file.type.split("/")[1];
                let icon: React.ReactNode;

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
                    <div key={index} className="relative overflow-hidden rounded-lg group size-full flex items-center justify-center">
                        <div className="flex flex-col size-full items-center justify-center space-y-2 object-cover group-hover:opacity-20 transition-opacity">
                            {icon}
                            <p className="w-full px-2 text-sm text-center truncate">{file.name}</p>
                        </div>
                        <div className="absolute inset-x-0 -inset-y-3 flex size-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button type="button" variant="light_foreground" size="fit" onClick={() => handleRemoveFile(index)}>
                                <TooltipComponent trigger={<Trash2 className="size-8 p-1.5" />} content={<div>{t('delete')}</div>} />
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}