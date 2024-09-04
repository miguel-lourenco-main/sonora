import * as React from "react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../../shadcn/drawer"

import { ScrollArea } from '../../shadcn/scroll-area';

import PDFViewer from '../simple/pdf-viewer'
import { cn } from "../../utils";
import LoadingPDF from "./loading-pdf";

if (typeof Promise.withResolvers === 'undefined') {
    Promise.withResolvers = function <T>() {
      let resolve!: (value: T | PromiseLike<T>) => void;
      let reject!: (reason?: any) => void;
      const promise = new Promise<T>((res: (value: T | PromiseLike<T>) => void, rej: (reason?: any) => void) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }

export default function PDFViewerDrawer({
    file,
    trigger,
}: {
    file: File | string | null;
    trigger: React.ReactNode;
}) {

    const [loaded, setLoaded] = React.useState(false)

    return (
        <Drawer direction='right'>
            <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>
            <DrawerContent className='h-screen top-0 right-0 left-auto mt-0 w-[800px] rounded-none bg-[#525659]' showBar={false}>
                <DrawerHeader className="hidden">
                    <DrawerTitle>{typeof file === 'string' ? file : file?.name}</DrawerTitle>
                    <DrawerDescription>{typeof file === 'string' ? file : file?.size}</DrawerDescription>
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