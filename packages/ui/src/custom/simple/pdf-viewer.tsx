"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { PDFFile } from "../_lib/types";

import 'core-js/full/promise/with-resolvers.js';
import LoadingPDF from "./loading-pdf";

import { LinearBlur } from "progressive-blur";
import { Button } from "../../shadcn/button";
import { useTranslation } from "react-i18next";

// Polyfill for environments where window is not available (e.g., server-side rendering)
import { withResolvers } from '../../utils/resolvers-polyfill'; // Create this file if needed

const { promise, resolve, reject } = withResolvers();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {};

const resizeObserverOptions = {};

const maxWidth = 1600;

export default function PDFViewer({ pdf, setLoaded }: { pdf: PDFFile, setLoaded: Dispatch<SetStateAction<boolean>>}) {
  
  const [file, setFile] = useState<PDFFile>(pdf);
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef.current, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess(pdf: pdfjs.PDFDocumentProxy): void {
    setTimeout(() => {
      setNumPages(pdf.numPages);
    }, 200); // 200 milliseconds delay
  }

  return (
    <div className="flex flex-col size-full max-h-full items-center justify-center" ref={containerRef}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
      >
        <div className="flex flex-col overflow-auto w-full items-center gap-y-6">
          {Array.from(new Array(numPages), (el, index) => (
            <div className="relative flex size-full" key={`page_${index + 1}`}>
              <Page
                className="mb-4 shadow-lg"
                pageNumber={index + 1}
                width={
                  containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
                }
                onLoadSuccess={() => {
                  if (numPages && index === numPages - 1) {
                    setTimeout(() => {
                      setLoaded(true)
                    }, 500)
                  }
                }}
              />
              {!hasEnoughCredits && index > 0 && (
                <>
                  <div className="absolute bottom-0 left-0 z-20 size-full backdrop-blur-sm pointer-events-none"/>
                  <div className="absolute bottom-0 left-0 z-30 size-full flex items-center justify-center">
                    <BuyMoreCreditsLayer />
                  </div>
                </>                
              )}
              {!hasEnoughCredits && index === 0 && (
                <>
                  <LinearBlur
                    side="bottom"
                    steps={10}
                    // The blur radius of the blur in pixels at the peak of the gradient. Default is 64.
                    strength={20}
                    // How much of the blur is falloff. 0 means no falloff, 100 means the entire blur is falloff. Default is 100.
                    falloffPercentage={60}
                    // The tint applied to the blur. This can be any valid CSS color. Default is transparent.
                    tint="rgba(0, 0, 0, 0.1)"
                    // You can pass any div props to the component. Useful for positioning.
                    style={{
                      position: "absolute",
                      right: "0px",
                      bottom: "0px",
                      left: "0px",
                      zIndex: 20,
                      pointerEvents: "none",
                      height: "75%"
                    }}
                  />
                  <div className="absolute bottom-0 left-0 z-30 flex w-full h-[75%] items-center justify-center bg-transparent">
                    <BuyMoreCreditsLayer />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
}

function BuyMoreCreditsLayer() {

  const { t } = useTranslation('ui');

  return(
    <div className="h-fit w-1/2 p-4 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg">
      <p className="text-foreground text-center mb-4 mx-2">{t('ui:purchaseMoreCreditsToViewThisPage')}</p>
      <Button
        onClick={() => {/* Add logic to buy more credits */}}
      >
        {t('ui:buyMoreCredits')}
      </Button>
    </div>
  )
}