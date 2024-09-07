"use client";

import React, { UIEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { LinearBlur } from "progressive-blur";
import { useTranslation } from "react-i18next";

import { PDFFile } from "../../_lib/types";
import { Button } from "../../../shadcn/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {};
const resizeObserverOptions = {};
const maxWidth = 800;

export default function SmartPDFViewer({ pdf, setLoaded, onScroll, scrollRef }: { pdf: PDFFile; setLoaded?: React.Dispatch<React.SetStateAction<boolean>>; scrollRef: React.RefObject<HTMLDivElement>;onScroll?: UIEventHandler<HTMLDivElement> | undefined}) {

  const [file, setFile] = useState<PDFFile>(pdf);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(maxWidth);
  const [pageHeight, setPageHeight] = useState<number>(maxWidth * 1.4142);
  const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(true);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;
    if (entry) {
      const width = Math.min(entry.contentRect.width, maxWidth);
      setPageWidth(width);
      setPageHeight(width * 1.4142);
    }
  }, []);

  useResizeObserver(scrollRef.current, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess(pdf: pdfjs.PDFDocumentProxy): void {
    setNumPages(pdf.numPages);
    if (setLoaded) setLoaded(true);
  }

  useEffect(() => {
    setFile(pdf);
  }, [pdf]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const pageNumber = parseInt(entry.target.getAttribute("data-page-number") || "0", 10);
        if (entry.isIntersecting) {
          setVisiblePages((prev) => [...prev, pageNumber]);
        } else {
          setVisiblePages((prev) => prev.filter((p) => p !== pageNumber));
        }
      });
    }, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex size-full items-start justify-center overflow-auto" ref={scrollRef} onScroll={onScroll}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        className="flex flex-col"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div
            key={`page_${index + 1}`}
            className="relative mb-4"
            style={{ height: pageHeight, width: pageWidth }}
            data-page-number={index + 1}
            ref={(el) => {
              if (el && observerRef.current) {
                observerRef.current.observe(el);
              }
            }}
          >
            {visiblePages.includes(index + 1) && (
              <Page
                className="shadow-lg"
                pageNumber={index + 1}
                width={pageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            )}
            {!hasEnoughCredits && index > 0 && (
              <>
                <div className="absolute inset-0 z-20 backdrop-blur-sm pointer-events-none" />
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                  <BuyMoreCreditsLayer />
                </div>
              </>
            )}
            {!hasEnoughCredits && index === 0 && (
              <>
                <LinearBlur
                  side="bottom"
                  steps={10}
                  strength={20}
                  falloffPercentage={60}
                  tint="rgba(0, 0, 0, 0.1)"
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
      </Document>
    </div>
  );
}

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