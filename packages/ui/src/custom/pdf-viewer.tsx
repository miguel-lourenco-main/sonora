"use client";

import React, { UIEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { PDFFile } from "./_lib/types";

import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { LinearBlur } from "progressive-blur";

// Import the polyfill
import { withResolvers } from '../utils/resolvers-polyfill';

// Use the polyfill only if Promise.withResolvers is not available
const promiseWithResolvers = Promise.withResolvers || withResolvers;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {};
const resizeObserverOptions = {};
const maxWidth = 800;

export default function PDFViewer(
  { pdf, setLoaded, setPdfLoading, onScroll, scrollRef, filter }
  : 
  { pdf: PDFFile; setLoaded?: (b: boolean) => void; setPdfLoading?: (b: boolean) => void; scrollRef?: React.RefObject<HTMLDivElement>; onScroll?: UIEventHandler<HTMLDivElement> | undefined; filter?: React.ReactNode}
) {

  const [file, setFile] = useState<PDFFile>(pdf);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(maxWidth);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(false);

  const observerRef = useRef<IntersectionObserver | null>(null)
  const genericRef = useRef<HTMLDivElement | null>(null);
  const firstPageRef = useRef<HTMLCanvasElement | null>(null);

  const containerRef = scrollRef || genericRef;

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

      const a4Width = 210; // mm
      const a4Height = 297; // mm

      const scale = a4Height / a4Width;

      const expectedHeight = pageWidth * scale;

      setPageHeight(expectedHeight);
    }
  }, [pageWidth]);

  function onDocumentLoadSuccess(pdf: pdfjs.PDFDocumentProxy): void {
    updatePageHeight();
    setNumPages(pdf.numPages);
    if (setLoaded) setLoaded(true);
    if (setPdfLoading) setPdfLoading(false);
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
    <div className="flex size-full items-start justify-center overflow-auto" ref={containerRef} onScroll={onScroll}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
        className="flex flex-col space-y-4"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div
            key={`page_${index + 1}`}
            className="relative shadow-lg"
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
                canvasRef={firstPageRef}
                pageNumber={index + 1}
                width={pageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onLoadSuccess={index === 0 ? updatePageHeight : undefined}
              />
            )}
            {!hasEnoughCredits && filter && index > 0 && (
              <>
                <div className="absolute bottom-0 left-0 z-20 size-full backdrop-blur-sm pointer-events-none"/>
                <div className="absolute bottom-0 left-0 z-30 size-full flex items-center justify-center">
                  {filter}
                </div>
              </>                
            )}
            {!hasEnoughCredits && filter && index === 0 && (
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
            )}
          </div>
        ))}
      </Document>
    </div>
  );
}