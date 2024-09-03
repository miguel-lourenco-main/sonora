'use client'

import { Dispatch, SetStateAction } from "react";
import CustomFileUploader from "./custom-file-upload";
import { Button } from "@kit/ui/button" 
import { Plus, Trash2 } from "lucide-react";
import TooltipComponent from "./tooltip-component";
import { FileBrowserInput } from "./file-browser-input";
import FilesGrid from "./files-grid";
import ComboboxAvatar from "./combox_avatar";
import { useTranslation } from "react-i18next";

const languages = [
    { value: "en", label: "English", flag: "🇬🇧" },
    { value: "fr", label: "French", flag: "🇫🇷" },
    { value: "es", label: "Spanish", flag: "🇪🇸" },
    { value: "de", label: "German", flag: "🇩🇪" },
    { value: "it", label: "Italian", flag: "🇮🇹" },
    { value: "pt", label: "Portuguese", flag: "🇵🇹" },
    { value: "ru", label: "Russian", flag: "🇷🇺" },
    { value: "ja", label: "Japanese", flag: "🇯🇵" },
    { value: "zh", label: "Chinese", flag: "🇨🇳" },
    { value: "ko", label: "Korean", flag: "🇰🇷" },
  ]

export default function DragNDropGrid({ files, setFiles }: { files: File[], setFiles: Dispatch<SetStateAction<File[]>> }) {

    const { t } = useTranslation('ui')

  return (
    <div className="flex flex-col justify-start size-full gap-4">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-x-3">
                <Button variant="light_foreground" size="fit" onClick={() => setFiles([])} disabled={files.length === 0} className="transition-opacity duration-400 ease-in-out" style={{ opacity: files.length === 0 ? 0.5 : 1 }}>
                    <TooltipComponent trigger={<Trash2 className="size-8 p-1.5" />} content={t('ui:deleteAllFiles')} />
                </Button>
                <FileBrowserInput
                    content={(handleFileUpload: () => void) => (
                        <Button variant="light_foreground" size="fit" onClick={() => handleFileUpload()}>
                            <TooltipComponent 
                                trigger={<Plus className="size-8 p-1.5"/>} 
                                content={t('ui:addFiles')}
                            />
                        </Button>
                    )}
                    acceptsTypes=".pdf"
                    addDroppedFiles={(files) => {
                        setFiles(prevFiles => [...prevFiles, ...files]);
                    }}
                />
            </div>
            <ComboboxAvatar list={languages} />
            <div className="flex gap-x-1 px-2 text-sm text-muted-foreground">{files.length} {files.length === 1 ? t('ui:file') : t('ui:files')} {t('ui:added')}</div>
        </div>
        <CustomFileUploader
            acceptFiles={{"application/pdf": [".pdf"]}}
            files={files}
            setFiles={(files) => (files ? setFiles(files) : {})}
        >
            <FilesGrid files={files} setFiles={setFiles} />
        </CustomFileUploader>
    </div>
  )
}