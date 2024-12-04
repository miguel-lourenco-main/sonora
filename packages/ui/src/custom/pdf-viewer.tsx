"use client";

import React, { UIEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { PDFFile } from "./_lib/types";

import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {};
const resizeObserverOptions = {};
const maxWidth = 800;

export default function PDFViewer(
  { pdf, setIsRendered, type, onScroll, scrollRef }
  : 
  { pdf: PDFFile; setIsRendered?: (b: boolean) => void; type?: string; onScroll?: UIEventHandler<HTMLDivElement> | undefined; scrollRef?: React.RefObject<HTMLDivElement>}
) {

  const [file, setFile] = useState<PDFFile>(pdf);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(maxWidth);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  //const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(false);

  const pdfDocumentRef = useRef<pdfjs.PDFDocumentProxy | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const genericRef = useRef<HTMLDivElement | null>(null);
  const firstPageRef = useRef<HTMLCanvasElement | null>(null);

  const containerRef = scrollRef ?? genericRef;

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;
    if (entry) {
      const width = Math.min(entry.contentRect.width, maxWidth);
      setPageWidth(width);
    }
  }, []);

  useResizeObserver(containerRef.current, resizeObserverOptions, onResize);

  const updatePageHeight = useCallback(() => {
    if (firstPageRef.current) {

      let fileWidth = 210; // mm
      let fileHeight = 297; // mm

      if ((file instanceof File && file.name.endsWith('.pptx')) ?? type === 'pptx') {
        fileWidth = 254;  // 10 inches in mm
        fileHeight = 190.5;
      }

      const scale = fileHeight / fileWidth;

      const expectedHeight = pageWidth * scale;

      setPageHeight(expectedHeight);
    }
  }, [pageWidth, file, type]);

  const cleanupPDF = useCallback(() => {

    if (pdfDocumentRef.current) {
      void pdfDocumentRef.current.destroy();
      pdfDocumentRef.current = null;
    }

    setNumPages(0);
    setVisiblePages([]);
    if (setIsRendered) setIsRendered(false);

  }, [setIsRendered]);

  useEffect(() => {
    setFile(pdf);
    cleanupPDF();
    if (setIsRendered) {
      setIsRendered(false); // Reset loaded state when PDF changes
    }
  }, [pdf, cleanupPDF, setIsRendered]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanupPDF();
    };
  }, [cleanupPDF]);

  function onDocumentLoadSuccess(pdfDoc: pdfjs.PDFDocumentProxy): void {
    if (!mountedRef.current) return;
    
    pdfDocumentRef.current = pdfDoc;
    setNumPages(pdfDoc.numPages);
    updatePageHeight();
    
    // Add a small delay before setting loaded to true
    timerRef.current = setTimeout(() => {
      if (mountedRef.current && setIsRendered) {
        setIsRendered(true);
      }
    }, 500);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      mountedRef.current = false;
      cleanupPDF();
    };
  }, [cleanupPDF]);

  useEffect(() => {
    const currentTimer = mountedRef.current;
    return () => {
      if (typeof currentTimer === 'number') {
        clearTimeout(currentTimer);
      }
      mountedRef.current = false;
      cleanupPDF();
    };
  }, [cleanupPDF]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const pageNumber = parseInt(entry.target.getAttribute("data-page-number") ?? "0", 10);
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
    <div 
      className="flex size-full items-start justify-center overflow-auto" 
      ref={containerRef} 
      onScroll={onScroll}
      style={{ maxHeight: '100%', height: '100%' }}
    >
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={cleanupPDF}
        options={options}
        className="flex flex-col space-y-4 w-full"
        loading={null}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div
            key={`page_${index + 1}`}
            className="relative shadow-lg mx-auto"
            style={{ 
              height: pageHeight, 
              width: pageWidth,
              minHeight: pageHeight
            }}
            data-page-number={index + 1}
            ref={(el) => {
              if (el && observerRef.current) {
                observerRef.current.observe(el);
              }
            }}
          >
            {visiblePages.includes(index + 1) && (
              <Page
                canvasRef={index === 0 ? firstPageRef : undefined}
                pageNumber={index + 1}
                width={pageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onLoadSuccess={index === 0 ? updatePageHeight : undefined}
                loading={null} // Prevent default loading indicator
              />
            )}
            {/*!hasEnoughCredits && filter && index > 0 && (
              <>
                <div className="absolute bottom-0 left-0 z-20 size-full backdrop-blur-sm pointer-events-none"/>
                <div className="absolute bottom-0 left-0 z-30 size-full flex items-center justify-center">
                  {filter}
                </div>
              </>                
            )*/}
            {/*!hasEnoughCredits && filter && index === 0 && (
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
                  {filter}
                </div>
              </>
            )*/}
          </div>
        ))}
      </Document>
    </div>
  );
}