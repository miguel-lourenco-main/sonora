import * as React from "react"
import { cn } from "../../utils";
import LoadingPDF from "./loading-pdf";
import DialogLayout from "../dialogs/dialog-layout";
import { File, FileType2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shadcn/tabs";
import SmartPDFViewer from "./smart-doc-viewer";

export default function PDFViewerDialog({
    file,
    trigger,
}: {
    file: File | string | null;
    trigger: React.ReactNode;
}) {
    const [loaded, setLoaded] = React.useState(false)
    const [isWideScreen, setIsWideScreen] = React.useState(window.innerWidth >= 1200)
    const { t } = useTranslation('ui')

    const scrollRefs = [React.useRef<HTMLDivElement>(null), React.useRef<HTMLDivElement>(null)]

    const [currentTab, setCurrentTab] = React.useState('original')

    React.useEffect(() => {
        const handleResize = () => setIsWideScreen(window.innerWidth >= 1200)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleScroll = (index: number) => (e: React.UIEvent<HTMLDivElement>) => {
        const otherIndex = 1 - index;
        if (scrollRefs[otherIndex]?.current) {
            scrollRefs[otherIndex]!.current!.scrollTop = e.currentTarget.scrollTop;
        }
    };

    const renderPDFView = React.useCallback((index: number) => {

        const ref = scrollRefs[index]

        return (
            <div 
                key={index}
                className="h-full w-full overflow-hidden border-muted border rounded-md"
            >
                {!loaded && <LoadingPDF />}
                { ref && (
                    <div className={cn(loaded ? "flex size-full" : "hidden")}>
                        <SmartPDFViewer pdf={file} setLoaded={setLoaded} onScroll={handleScroll(index)} scrollRef={ref}/>
                    </div>
                )}
            </div>
        )
    }, [loaded, file, handleScroll]);

    return (
        <DialogLayout
            trigger={() => trigger}
            title={t('compareDocuments')}
            description={typeof file === 'string' ? file : file?.name}
            contentClassName="flex flex-col h-[90vh] w-[90vw] max-w-[100rem]"
        >
            { isWideScreen ? (
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="grid grid-cols-2 place-items-center mx-4 mb-4">
                        {['original', 'translated'].map((key, i) => (
                            <div key={key} className="flex justify-center items-center size-fit gap-x-2 my-2 p-2 bg-muted rounded-md text-muted-foreground text-sm text-center font-semibold">
                                {i === 0 ? <File className="size-5" /> : <FileType2 className="size-5" />}
                                <p>{t(key)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-x-6 overflow-hidden">
                        {[0, 1].map(renderPDFView)}
                    </div>
                </div>
            ):(
                <Tabs value={currentTab} onValueChange={setCurrentTab} defaultValue="input_files" className='flex flex-col flex-1 w-full overflow-hidden items-center'>
                    <TabsList className="h-fit w-fit justify-start bg-muted border-1.5 border-muted mb-4">
                        <TabsTrigger
                            onClick={() => setLoaded(false)}
                            value="original"
                            className="flex h-9 rounded-md items-center justify-center px-auto py-3 gap-x-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:bg-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                        >
                            <File className="size-5" />
                            Original
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setLoaded(false)}
                            value="translated"
                            className="flex h-9 rounded-md items-center justify-center px-auto py-3 gap-x-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:bg-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                        >
                            <FileType2 className="size-5" />
                            Translated
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex-1 w-full overflow-hidden">
                        <TabsContent value="original" className="h-full mt-0">
                            {renderPDFView(0)}
                        </TabsContent>
                        <TabsContent value="translated" className="h-full mt-0">
                            {renderPDFView(1)}
                        </TabsContent>
                    </div>
                </Tabs>
            )}
        </DialogLayout>
    );
}