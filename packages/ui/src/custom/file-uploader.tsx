import { Button } from "@kit/ui/button";
import { FileInputButton } from "@kit/ui/files-input-button";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import TooltipComponent from "@kit/ui/tooltip-component";
import { FILE_SUPPORTED_TYPES, FILE_SUPPORTED_TYPES_VALUES_STRING } from "@kit/shared/constants";
import FilesDragNDrop from "@kit/ui/files-drag-n-drop";
import FilesGrid from "@kit/ui/files-grid";
import { TrackableFile } from "@kit/shared/types";

interface FileUploadProps {
    files?: TrackableFile[];
    setFiles?: Dispatch<SetStateAction<TrackableFile[]>>;
    disabled?: boolean;
    onAddFiles?: (files: TrackableFile[]) => void;
    onRemoveFiles?: (files: TrackableFile[]) => void;
}

interface FileHandlers {
    handleDeleteAll: () => void;
    handleAddFiles: (newFiles: File[]) => void;
    handleFileRemove: (filteredFiles: File[]) => void;
}

const FileActionsBar = ({ 
    files, 
    disabled, 
    handlers 
}: { 
    files: TrackableFile[], 
    disabled?: boolean, 
    handlers: Pick<FileHandlers, 'handleDeleteAll' | 'handleAddFiles'> 
}) => {
    const { t } = useTranslation('custom');

    return (
        <div className="flex items-end justify-between px-2">
            <div className="flex items-center gap-x-3">
                <Button
                    type="button"
                    variant="light_foreground"
                    size="fit"
                    onClick={handlers.handleDeleteAll}
                    disabled={files.length === 0 || disabled}
                    className="transition-opacity duration-400 ease-in-out"
                    style={{ opacity: files.length === 0 ? 0.5 : 1 }}
                >
                    <TooltipComponent 
                        trigger={<Trash2 className="size-8 p-1.5" />} 
                        content={t('deleteAllFiles')} 
                    />
                </Button>
                <FileInputButton
                    content={(handleFileUpload: () => void) => (
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="fit" 
                            onClick={handleFileUpload}
                            disabled={disabled}
                        >
                            <TooltipComponent 
                                trigger={<Plus className="size-8 p-1.5"/>} 
                                content={t('addFiles')}
                            />
                        </Button>
                    )}
                    acceptsTypes={FILE_SUPPORTED_TYPES_VALUES_STRING}
                    addDroppedFiles={handlers.handleAddFiles}
                />
            </div>
            <span className="whitespace-nowrap text-sm text-muted-foreground">
                {`${files.length} ${files.length === 1 ? t('file') : t('files')} ${t('added')}`}
            </span>
        </div>
    );
};

export function FileUploader({
    files: externalFiles,
    setFiles: externalSetFiles,
    disabled,
    onAddFiles,
    onRemoveFiles
}: FileUploadProps) {

    const [internalFiles, setInternalFiles] = useState<TrackableFile[]>([]);
    const files = externalFiles ?? internalFiles;

    const setFiles = useCallback((newFiles: SetStateAction<TrackableFile[]>) => {
        const updatedFiles = typeof newFiles === 'function' ? newFiles(files) : newFiles;
        if (externalSetFiles) {
            externalSetFiles(updatedFiles);
        } else {
            setInternalFiles(updatedFiles);
        }
    }, [externalSetFiles, files]);

    const fileHandlers: FileHandlers = {
        handleDeleteAll: useCallback(() => {
            setFiles([]);
        }, [setFiles]),

        handleAddFiles: useCallback((newFiles: TrackableFile[]) => {

            if (onAddFiles) {
                onAddFiles(newFiles);
            } else {
                setFiles(prevFiles => [...prevFiles, ...newFiles]);
            }
        }, [setFiles, onAddFiles]),

        handleFileRemove: useCallback((filterFiles: TrackableFile[]) => {
            if (onRemoveFiles) {
                onRemoveFiles(filterFiles);
            } else {
                setFiles(prevFiles => prevFiles.filter(file => !filterFiles.includes(file)));
            }
        }, [setFiles, onRemoveFiles])
    };

    return (
        <div className="flex flex-col gap-4 size-full">
            <FileActionsBar 
                files={files} 
                disabled={disabled} 
                handlers={fileHandlers} 
            />
            <FilesDragNDrop
                acceptFiles={FILE_SUPPORTED_TYPES}
                files={files}
                addFiles={fileHandlers.handleAddFiles}
                removeFiles={fileHandlers.handleFileRemove}
                disabled={disabled}
            >
                <FilesGrid 
                    files={files} 
                    onFileRemove={fileHandlers.handleFileRemove}
                    disabled={disabled} 
                />
            </FilesDragNDrop>
        </div>
    );
} 