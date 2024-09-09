import { useCallback, useState, useEffect, useRef, ReactNode, UIEvent } from 'react';
import { cn } from "../utils";
import LoadingPDF from "./loading-pdf";
import DialogLayout from "./dialog-layout";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import PDFViewer from "./pdf-viewer";
import { Button } from "../shadcn/button";

export default function PDFViewerDialog({
    fileId,
    trigger,
    title,
    description,
    tabs
}: {
    fileId: string;
    trigger: ReactNode;
    title: string;
    description: string;
    tabs: {
        icon: ReactNode;
        label: string;
    }[];
}) {
    const [loaded, setLoaded] = useState(false)
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1200)
    const [file, setFile] = useState<File | null>(null)

    //const { t } = useTranslation('ui')

    const scrollRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]

    const [currentTab, setCurrentTab] = useState('original')

    useEffect(() => {
        const fetchFile = async () => {
            // TODO: insert getFile function from sdk
            const file = new File([], "") //await getFile(fileId)
            setFile(file)
        }
        fetchFile()
    }, [fileId])

    useEffect(() => {
        const handleResize = () => setIsWideScreen(window.innerWidth >= 1200)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleScroll = (index: number) => (e: UIEvent<HTMLDivElement>) => {
        const otherIndex = 1 - index;
        if (scrollRefs[otherIndex]?.current) {
            scrollRefs[otherIndex]!.current!.scrollTop = e.currentTarget.scrollTop;
        }
    };

    function BuyMoreCreditsLayer() {
        const { t } = useTranslation('ui');
      
        return (
          <div className="h-fit w-1/2 p-4 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg">
            <p className="text-foreground text-center mb-4 mx-2">{t('ui:purchaseMoreCreditsToViewThisPage')}</p>
            <Button onClick={() => {/* Add logic to buy more credits */}}>
              {t('ui:buyMoreCredits')}
            </Button>
          </div>
        );
      }

    const renderPDFView = useCallback((index: number) => {

        const ref = scrollRefs[index]

        return (
            <div 
                key={index}
                className="h-full w-full overflow-hidden border-muted border rounded-md"
            >
                {!loaded && <LoadingPDF />}
                { ref && (
                    <div className={cn(loaded ? "flex size-full" : "hidden")}>
                        <PDFViewer pdf={file} setLoaded={setLoaded} onScroll={handleScroll(index)} scrollRef={ref} filter={<BuyMoreCreditsLayer />}/>
                    </div>
                )}
            </div>
        )
    }, [loaded, file, handleScroll]);

    return (
        <DialogLayout
            trigger={() => trigger}
            title={title}
            description={description}
            contentClassName="flex flex-col h-[90vh] w-[90vw] max-w-[100rem]"
        >
            { isWideScreen ? (
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="grid grid-cols-2 place-items-center mx-4 mb-4">
                        {tabs.map((tab, i) => (
                            <div key={i} className="flex justify-center items-center size-fit gap-x-2 my-2 p-2 bg-muted rounded-md text-muted-foreground text-sm text-center font-semibold">
                                {tab.icon}
                                {tab.label}
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
                            className="flex h-9 rounded-md items-center justify-center px-auto py-3 gap-x-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-none"
                        >
                            {tabs[0]?.icon}
                            {tabs[0]?.label}
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setLoaded(false)}
                            value="translated"
                            className="flex h-9 rounded-md items-center justify-center px-auto py-3 gap-x-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-none"
                        >
                            {tabs[1]?.icon}
                            {tabs[1]?.label}
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