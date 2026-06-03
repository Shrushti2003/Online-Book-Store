"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DocumentReader({ type, url }: { type: string; url: string }) {
  const epubRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renditionRef = useRef<{ next: () => Promise<unknown>; prev: () => Promise<unknown> } | null>(null);
  const pdfRef = useRef<{ getPage: (page: number) => Promise<unknown>; numPages: number } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("Loading document...");

  useEffect(() => {
    let active = true;

    async function loadEpub() {
      try {
        const epubModule = await import("epubjs");
        const ePub = epubModule.default;
        const book = ePub(url);
        if (!epubRef.current || !active) return;
        const rendition = book.renderTo(epubRef.current, { width: "100%", height: "72vh", spread: "none" });
        renditionRef.current = rendition;
        await rendition.display();
        setStatus("EPUB reader ready.");
      } catch {
        setStatus("This EPUB could not be loaded in-browser. Use the provider download link instead.");
      }
    }

    async function renderPdfPage(nextPage: number) {
      const pdf = pdfRef.current;
      const canvas = canvasRef.current;
      if (!pdf || !canvas) return;
      const pageDoc = await pdf.getPage(nextPage) as { getViewport: (options: { scale: number }) => { width: number; height: number }; render: (options: unknown) => { promise: Promise<unknown> } };
      const viewport = pageDoc.getViewport({ scale: 1.35 });
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await pageDoc.render({ canvasContext: context, viewport }).promise;
      setPage(nextPage);
      setStatus("PDF reader ready.");
    }

    async function loadPdf() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
        const pdf = await pdfjs.getDocument({ url }).promise;
        if (!active) return;
        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);
        await renderPdfPage(1);
      } catch {
        setStatus("This PDF could not be loaded in-browser. Use the provider download link instead.");
      }
    }

    if (type === "epub") loadEpub();
    if (type === "pdf") loadPdf();

    return () => {
      active = false;
    };
  }, [type, url]);

  async function next() {
    if (type === "epub") await renditionRef.current?.next();
    if (type === "pdf" && page < totalPages) {
      const pdf = pdfRef.current;
      const canvas = canvasRef.current;
      if (!pdf || !canvas) return;
      const pageDoc = await pdf.getPage(page + 1) as { getViewport: (options: { scale: number }) => { width: number; height: number }; render: (options: unknown) => { promise: Promise<unknown> } };
      const viewport = pageDoc.getViewport({ scale: 1.35 });
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await pageDoc.render({ canvasContext: context, viewport }).promise;
      setPage(page + 1);
    }
  }

  async function previous() {
    if (type === "epub") await renditionRef.current?.prev();
    if (type === "pdf" && page > 1) {
      const pdf = pdfRef.current;
      const canvas = canvasRef.current;
      if (!pdf || !canvas) return;
      const pageDoc = await pdf.getPage(page - 1) as { getViewport: (options: { scale: number }) => { width: number; height: number }; render: (options: unknown) => { promise: Promise<unknown> } };
      const viewport = pageDoc.getViewport({ scale: 1.35 });
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await pageDoc.render({ canvasContext: context, viewport }).promise;
      setPage(page - 1);
    }
  }

  return (
    <Card className="p-4">
      <p className="mb-4 text-sm font-bold text-[#7B61FF]">{status}</p>
      {type === "epub" ? <div ref={epubRef} /> : <canvas className="mx-auto max-w-full" ref={canvasRef} />}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Button onClick={previous} type="button" variant="glass">Previous</Button>
        <p className="text-sm font-bold opacity-70">{type === "pdf" ? `Page ${page} of ${totalPages}` : "EPUB flow"}</p>
        <Button onClick={next} type="button" variant="glass">Next</Button>
      </div>
    </Card>
  );
}
