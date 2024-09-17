'use client'

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { Paperclip, Plus, X } from "lucide-react"
import { InputFile } from "../lib/types"
import { TreeView } from "@kit/ui/tree-view"
import { TreeViewElement } from "@kit/ui/tree-view-api"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kit/ui/tooltip";
import { FileBrowserInput } from "@kit/ui/file-browser-input"
import { getAuthToken } from "@kit/supabase/get-auth-token";
import { cn } from "@kit/ui/utils";
import { toast } from "sonner";
import { uploadFiles } from "../lib/actions";
import { fetchSS, fileToObject } from "../lib/utils";
import { I18nComponent } from "@kit/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kit/ui/tabs"
import { useIsRightSidebarOpen } from "../lib/hooks/use-open-files"
import { Button } from "@kit/ui/button"
import { useUserAwareFiles } from '../lib/hooks/use-current-session-files'


export function ChatRightSidebar({
    sessionFiles,
    onHoldFiles,
    setOnHoldFiles,
    id
}: {
    sessionFiles: [InputFile[], TreeViewElement]
    onHoldFiles: File[]
    setOnHoldFiles: Dispatch<SetStateAction<File[]>>
    id: string
}) {

    const { isRightSidebarOpen, setIsRightSidebarOpen, currentTab, setCurrentTab } = useIsRightSidebarOpen()

    const { hasNewFiles, setHasNewFiles, value, setValue, setUserAwareFiles, sessionId} = useUserAwareFiles()

// TODO: number of files affects performance in dev mode
  return (
    <div className={cn("flex flex-col items-center h-full ease-in-out transition-all duration-300 bg-rightSidebar rounded-lg overflow-hidden custom-shadow-box", isRightSidebarOpen ? 'w-[500px] border' : 'w-[0px]')}>
        <div className="flex w-full items-center justify-between p-4">
            <span className="font-medium">
                <I18nComponent i18nKey="vercel:files"/>
            </span>
            <X className="h-5 w-5 stroke-current cursor-pointer" onClick={() => setIsRightSidebarOpen(false)}/>
        </div>
        <Tabs value={currentTab} onValueChange={setCurrentTab} defaultValue="input_files" className='flex flex-col items-center relative size-full'>
          <TabsList className="w-full justify-start border-b bg-transparent rounded-none rounded-tl-md pt-2">
            <TabsTrigger
              value="input_files"
              className="relative h-9 rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:bg-transparent data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              onClick={() => {
                if(hasNewFiles && value.includes('input_files')){
                    setHasNewFiles(false)
                    setValue(prev => prev.filter(tab => tab !== 'input_files'))
                    setUserAwareFiles(sessionFiles)
                    }
                }}
            >
            {hasNewFiles && value.includes('input_files') && (
                <div className='absolute bottom-7 right-1 rounded-full bg-red-500 w-2 h-2'/>
            )}
              Input
            </TabsTrigger>
            <TabsTrigger
              value="generated_files"
              className="relative h-9 rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:bg-transparent data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                onClick={() => {
                    if(hasNewFiles && value.includes('generated_files')){
                        setHasNewFiles(false)
                        setValue(prev => prev.filter(tab => tab !== 'generated_files'))
                        setUserAwareFiles(sessionFiles)
                    }
                }}
            >
            {hasNewFiles && value.includes('generated_files') && (
                <div className='absolute bottom-8 right-4 rounded-full bg-red-500 w-2 h-2'/>
            )}
              Generated
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input_files" className="size-full">
            <InputFileTab inputFiles={[...sessionFiles[0], ...onHoldFiles.map((file) => ({...file, name: `(On Hold) ${file.name}`}))]} sessionId={sessionId} setOnHoldFiles={setOnHoldFiles} />
          </TabsContent>
          <TabsContent value="generated_files" className="size-full">
             <OutputFileTab generatedFiles={sessionFiles[1]} sessionId={sessionId}/>
          </TabsContent>
        </Tabs>
      </div>
  )
}

export function OutputFileTab({generatedFiles, sessionId}: {generatedFiles: TreeViewElement, sessionId: string}){

    const [openFirst, setOpenFirst] = useState(true)

    const { hasNewFiles, userAwareFiles } = useUserAwareFiles()
    const { isRightSidebarOpen, currentTab } = useIsRightSidebarOpen()

    useEffect(() => {

        if(hasNewFiles || (isRightSidebarOpen && currentTab === "generated_files")){
            setOpenFirst(true)
        }
    }, [hasNewFiles, isRightSidebarOpen, currentTab, userAwareFiles])

    return(
        <div className="flex flex-col h-full custom-scrollbar text-sm">
            <div className="size-full p-2">
                {generatedFiles.children && generatedFiles.children.length > 0 ? (
                    <TreeView
                        elements={generatedFiles.children}
                        className="size-full"
                        openFirst={openFirst}
                        setOpenFirst={setOpenFirst}
                        onFileClick={async (path: string) => {
                            try {
                                const auth_token = await getAuthToken()
                            
                                if (!auth_token || !sessionId) throw Error("No auth token")
                            
                                const response = await fetchSS(`/files/${sessionId}/${path}`, {
                                    headers: {
                                        "Authorization": `Bearer ${auth_token}`
                                    }
                                })
                            
                                if (!response.ok) throw new Error('Failed to download file')
                            
                                const file = await response.blob()
                            
                                const url = URL.createObjectURL(file)

                                const a = document.createElement('a');
                                a.href = url;
                                a.download = path.split('/').pop() || "file"; // Assumes 'path' includes the filename
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            
                            } catch (error) {
                                console.error('Download file error:', error)
                                throw error // Rethrow the error to handle it in the calling function
                            }      
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center size-full text-muted-foreground">
                        <I18nComponent i18nKey="vercel:no_files_generated" />
                    </div>
                )}
            </div>
        </div>
    )
}


export function InputFileTab({inputFiles, sessionId, setOnHoldFiles}: {inputFiles: InputFile[], sessionId: string, setOnHoldFiles: Dispatch<SetStateAction<File[]>>}){

    const submitFiles = useCallback(async (selectedFiles: File[]) => {

        try{
            const auth_token = await getAuthToken()

            if(sessionId !== "-1" && auth_token){

                // TODO: this should be fine since there is no reason it should fail, and if there is, it
                // probably applies to all files, not just one
                const convertedFiles = await Promise.all(selectedFiles.map((file) => fileToObject(file)))

                uploadFiles(sessionId, convertedFiles).then((res) => {

                    const [_, failedSubmissions] = res

                    if(failedSubmissions && failedSubmissions.length > 0){
                        // TODO: test this for many fails, to see how toast handles big strings
                        toast.warning(`Failed to submit some files: ${failedSubmissions.join(", ")}`)
                    }else{
                        toast.success("Files submitted")
                    }
                })
            }
            else if(sessionId === "-1"){
                setOnHoldFiles((prev:File[]) => [...prev, ...selectedFiles])
                toast.success("File ready to be submitted. Send a message to create a session and submit the files")
            }
            else{
                toast.error("No Auth Token")
            }
        }catch(error){
            console.error(error)
        }
    }, [setOnHoldFiles, sessionId])

    return(
        <div className="flex flex-col size-full text-sm">
            <div className="size-full custom-scrollbar mb-4">
                <div className="flex flex-col h-full gap-2 p-3">
                    {inputFiles &&
                        inputFiles.length > 0 && inputFiles.map((file, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Paperclip className="h-3.5 w-3.5 stroke-current" />
                                <span className="flex-1 truncate">{file.name}</span>
                            </div>
                        ))
                    }
                    {!inputFiles || inputFiles.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-muted-foreground">
                                <I18nComponent i18nKey="vercel:no_files" />
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex w-full items-center justify-end p-3.5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FileBrowserInput
                                content={(handleFileUpload: () => void) => (
                                    <Button
                                        onClick={() => handleFileUpload()}
                                        type="submit" 
                                        size="icon"
                                        shape="circle"
                                    >
                                        <Plus 
                                            className="h-5 w-5"
                                    />
                                        <span className="sr-only">
                                            <I18nComponent i18nKey="vercel:submit_files" />
                                        </span>
                                    </Button>
                                )}
                                acceptsTypes=".txt, .pdf"
                                addDroppedFiles={submitFiles}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <I18nComponent i18nKey="vercel:submit_files" />
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}