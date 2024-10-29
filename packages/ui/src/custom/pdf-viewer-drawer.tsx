import * as React from "react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../shadcn/drawer"

import { ScrollArea } from "../shadcn/scroll-area";

import PDFViewer from './pdf-viewer'
import { cn } from "../lib/utils";
import LoadingPDF from "./loading-pdf"

export default function PDFViewerDrawer({
    file,
    trigger,
    title,
    description
}: {
    file: File | string | null;
    trigger: React.ReactNode;
    title: string;
    description: string;
}) {

    const [loaded, setLoaded] = React.useState(false)

    return (
        <Drawer direction='right'>
            <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>
            <DrawerContent className='h-screen top-0 right-0 left-auto mt-0 w-[800px] rounded-none bg-[#525659]' showBar={false}>
                <DrawerHeader className="hidden">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <ScrollArea className='h-screen px-10'>
                    {!loaded && <LoadingPDF />}
                    <div className={cn(loaded ? "flex" : "hidden")}>
                        <PDFViewer pdf={file} setLoaded={setLoaded} />
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}