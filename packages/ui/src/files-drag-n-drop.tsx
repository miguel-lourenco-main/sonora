import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@kit/ui/lib';
import { TrackableFile } from '@kit/ui/interfaces';

interface FilesDragNDropProps {
    acceptFiles: Record<string, string[]>;
    files: TrackableFile[];
    addFiles: (files: TrackableFile[]) => void;
    removeFiles: (files: TrackableFile[]) => void;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}

export default function FilesDragNDrop({
    acceptFiles,
    files,
    addFiles,
    removeFiles,
    disabled,
    children,
    className
}: FilesDragNDropProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Firefox-compatible file type checking
        const validFiles = acceptedFiles.filter(file => {
            // Get both MIME type and extension
            const fileType = file.type || '';
            const fileName = file.name.toLowerCase();
            
            return Object.entries(acceptFiles).some(([mime, exts]) => {
                const mimeMatch = fileType.startsWith(mime);
                const extMatch = exts.some(ext => fileName.endsWith(ext.toLowerCase()));
                return mimeMatch || extMatch;
            });
        });

        const trackableFiles: TrackableFile[] = validFiles.map(file => ({
            fileObject: file,
            uploadingStatus: 'client'
        }));
        
        if (validFiles.length !== acceptedFiles.length) {
            console.warn('Some files were filtered out due to invalid types');
        }
        
        addFiles(trackableFiles);
    }, [addFiles, acceptFiles]);

    // Convert acceptFiles to format that Firefox understands
    const acceptFormat = Object.entries(acceptFiles).reduce((acc, [mime, exts]) => ({
        ...acc,
        [mime]: exts,
        ...exts.reduce((obj, ext) => ({ ...obj, [`.${ext.replace('.', '')}`]: [] }), {})
    }), {});

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptFormat,
        disabled,
        multiple: true,
        noClick: disabled,
        noKeyboard: disabled,
        preventDropOnDocument: true
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "flex items-center justify-center rounded-lg border border-dashed p-8",
                isDragActive && "border-primary bg-muted",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <input {...getInputProps()} />
            {children}
        </div>
    );
} 