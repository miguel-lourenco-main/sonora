import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../shadcn/button";
import TooltipComponent from "./tooltip-component";
import { FileInputButton } from "./files-input-button";
import { Plus, Trash2 } from "lucide-react";
import FilesDragNDrop from "./files-drag-n-drop";
import FilesGrid from "./files-grid";
import { FILE_SUPPORTED_TYPES, FILE_SUPPORTED_TYPES_VALUES_STRING } from "@kit/shared/constants";

export default function FileUploadSimple({ 
    files, 
    setFiles, 

}: { 
    files: File[], 
    setFiles: Dispatch<SetStateAction<File[]>>, 

}) {
    const { t } = useTranslation('ui');

    const handleDeleteAll = () => {
        setFiles([]);
    };

    const handleAddFiles = (newFiles: File[]) => {
        setFiles(prevState => [...prevState, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prevState => prevState.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col justify-start size-full gap-4">
            <div className="flex items-end justify-between px-2">
                <div className="flex items-center gap-x-3">
                    <Button
                        type="button"
                        variant="light_foreground"
                        size="fit"
                        onClick={handleDeleteAll}
                        disabled={files.length === 0}
                        className="transition-opacity duration-400 ease-in-out"
                        style={{ opacity: files.length === 0 ? 0.5 : 1 }}
                    >
                        <TooltipComponent trigger={<Trash2 className="size-8 p-1.5" />} content={t('deleteAllFiles')} />
                    </Button>
                    <FileInputButton
                        content={(handleFileUpload: () => void) => (
                            <Button type="button" variant="light_foreground" size="fit" onClick={handleFileUpload}>
                                <TooltipComponent 
                                    trigger={<Plus className="size-8 p-1.5"/>} 
                                    content={t('addFiles')}
                                />
                            </Button>
                        )}
                        acceptsTypes={FILE_SUPPORTED_TYPES_VALUES_STRING}
                        addDroppedFiles={handleAddFiles}
                    />
                </div>
                <div className="flex gap-x-1 px-2 whitespace-nowrap text-sm text-muted-foreground">
                    {files.length} {files.length === 1 ? t('file') : t('files')} {t('added')}
                </div>
            </div>
            <FilesDragNDrop
                acceptFiles={FILE_SUPPORTED_TYPES}
                files={files}
                setFiles={setFiles}
            >
                <FilesGrid files={files} onFileRemove={handleRemoveFile} />
            </FilesDragNDrop>
        </div>
    );
}