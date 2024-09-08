"use client";

import React, { UIEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { PDFFile } from "./_lib/types";

import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import 'core-js/full/promise/with-resolvers.js';

// Polyfill for environments where window is not available (e.g., server-side rendering)
import { withResolvers } from '../utils/resolvers-polyfill'; // Create this file if needed

const { promise, resolve, reject } = withResolvers();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {};
const resizeObserverOptions = {};
const maxWidth = 800;

export default function PDFViewer(
  { pdf, setLoaded, onScroll, scrollRef, filter }
  : 
  { pdf: PDFFile; setLoaded?: (b: boolean) => void; scrollRef?: React.RefObject<HTMLDivElement>; onScroll?: UIEventHandler<HTMLDivElement> | undefined; filter?: React.ReactNode}
) {

  const [file, setFile] = useState<PDFFile>(pdf);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(maxWidth);
  const [pageHeight, setPageHeight] = useState<number>(maxWidth * 1.4142);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  //const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(true);


  const observerRef = useRef<IntersectionObserver | null>(null)
  const genericRef = useRef<HTMLDivElement | null>(null);

  const containerRef = scrollRef || genericRef;

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;
    if (entry) {
      const width = Math.min(entry.contentRect.width, maxWidth);
      setPageWidth(width);
      setPageHeight(width * 1.4142);
    }
  }, []);

  useResizeObserver(containerRef.current, resizeObserverOptions, onResize);

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
    <div className="flex size-full items-start justify-center overflow-auto" ref={containerRef} onScroll={onScroll}>
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
            {filter && filter}
          </div>
        ))}
      </Document>
    </div>
  );
}