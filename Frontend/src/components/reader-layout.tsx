"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bookmark,
  ChevronsLeft,
  ChevronsRight,
  Expand,
  Highlighter,
  Languages,
  Maximize2,
  Mic,
  Minimize2,
  ScanText,
  Volume2
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Book } from "@/types/book";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type ReaderPayload = {
  book: Book;
  readerMode: "preview" | "full-or-external" | "full";
  isFullTextAvailable: boolean;
  pages: Array<string[] | string>;
  chapters: { title: string; page: number }[];
  fullTextUrl?: string | null;
  epubUrl?: string | null;
  pdfUrl?: string | null;
  htmlUrl?: string | null;
  borrowUrl?: string | null;
  source?: string;
  message?: string;
};

type SpeechRecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
};

const samplePayload: ReaderPayload = {
  book: {
    id: "starlit-archive",
    title: "The Starlit Archive",
    author: "Mira Vale",
    genre: "Sci-Fi",
    mood: "Wonder",
    rating: 4.9,
    cover: "linear-gradient(145deg, #3AEFFF, #7B61FF)",
    description: "A memory architect finds a forbidden library orbiting a dying moon."
  },
  readerMode: "preview",
  isFullTextAvailable: false,
  pages: [
    [
      "The library opened like a sunrise behind glass. Every shelf remembered the hands that had touched it, and every page held the hush of a room waiting to become a world.",
      "Lumi listened as you read. Not loudly. Not eagerly. Just close enough to notice when a sentence asked to be explained, translated, saved, or spoken back in a voice made of warm light."
    ],
    [
      "Outside, the city kept scrolling. Inside, the story slowed time into something human. The next chapter waited with the patience of a door that already knew your hand.",
      "This preview is arranged as readable pages because many providers only expose limited preview content. When a publisher offers a full reader, Lumi links you there instead of pretending the full text is available."
    ]
  ],
  chapters: [
    { title: "Opening", page: 0 },
    { title: "Preview", page: 1 }
  ],
  message: "Only preview metadata is available for this sample."
};

function loadingPayload(bookId: string): ReaderPayload {
  return {
    book: {
      id: bookId,
      title: "Loading selected book...",
      author: "",
      genre: "Preview",
      mood: "Loading",
      rating: 0,
      cover: "linear-gradient(145deg, #3AEFFF, #7B61FF)",
      description: ""
    },
    readerMode: "preview",
    isFullTextAvailable: false,
    pages: [[""]],
    chapters: [{ title: "Preview Metadata", page: 0 }]
  };
}

const themes = {
  light: "bg-white text-[#1E1E1E]",
  sepia: "bg-[#f4e3c1] text-[#2f2118]",
  dark: "bg-[#111116] text-[#FFF7ED]"
};

type ThemeName = keyof typeof themes;

function storageKey(bookId: string) {
  return `lumibooks:reader:${bookId}`;
}

function bookmarkKey(bookId: string) {
  return `lumibooks:bookmarks:${bookId}`;
}

function readSavedPage(bookId: string, maxPage: number) {
  if (typeof window === "undefined") return 0;
  const saved = Number(window.localStorage.getItem(storageKey(bookId)) ?? 0);
  return Number.isFinite(saved) ? Math.min(Math.max(saved, 0), Math.max(maxPage, 0)) : 0;
}

function readBookmarks(bookId: string) {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(bookmarkKey(bookId)) ?? "[]") as number[];
  } catch {
    return [];
  }
}

function currentPageText(pageText: string[]) {
  return pageText.join("\n\n");
}

function normalizePageText(pageText: unknown) {
  if (Array.isArray(pageText)) return pageText;
  if (typeof pageText === "string") return pageText.split(/\n{2,}/).filter(Boolean);
  if (pageText && typeof pageText === "object") return Object.values(pageText).filter((value): value is string => typeof value === "string");
  return [];
}

export function ReaderLayout() {
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("book") ?? "starlit-archive";
  const readerMode = searchParams.get("mode") === "full" ? "full" : "preview";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [payload, setPayload] = useState<ReaderPayload>(samplePayload);
  const [loadingBook, setLoadingBook] = useState(false);
  const [bookError, setBookError] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const [lineHeight, setLineHeight] = useState(1.85);
  const [fontFamily, setFontFamily] = useState("Space Grotesk");
  const [brightness, setBrightness] = useState(96);
  const [theme, setTheme] = useState<ThemeName>("light");
  const [page, setPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);
  const [toolResult, setToolResult] = useState("");
  const [toolLoading, setToolLoading] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [language, setLanguage] = useState("Hindi");

  const pages = payload.pages.length ? payload.pages : bookId === "starlit-archive" ? samplePayload.pages : [[""]];
  const chapters = payload.chapters.length ? payload.chapters : [{ title: bookId === "starlit-archive" ? "Start" : "Preview Metadata", page: 0 }];
  const book = payload.book;
  const pageText = normalizePageText(pages[page] ?? pages[0]);
  const progress = Math.round(((page + 1) / pages.length) * 100);
  const selectedText = typeof window !== "undefined" ? window.getSelection()?.toString().trim() : "";

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoadingBook(true);
      setBookError("");
      try {
        if (bookId === "starlit-archive") {
          setPayload(samplePayload);
          setPage(readSavedPage(bookId, samplePayload.pages.length - 1));
          setBookmarkedPages(readBookmarks(bookId));
          return;
        }
        setPayload(loadingPayload(bookId));
        setPage(0);
        setBookmarkedPages([]);
        const response = await fetch(`${API_URL}/books/${encodeURIComponent(bookId)}/read?mode=${readerMode}`);
        if (!response.ok) throw new Error("Book data could not be loaded.");
        const nextPayload = (await response.json()) as ReaderPayload;
        if (!active) return;
        setPayload(nextPayload);
        setPage(readSavedPage(bookId, nextPayload.pages.length - 1));
        setBookmarkedPages(readBookmarks(bookId));
      } catch (error) {
        if (active) setBookError(error instanceof Error ? error.message : "Book data could not be loaded.");
      } finally {
        if (active) setLoadingBook(false);
      }
    }

    loadBook();
    return () => {
      active = false;
      window.speechSynthesis?.cancel();
    };
  }, [bookId, readerMode]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    function loadVoices() {
      setVoices(window.speechSynthesis.getVoices());
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  function go(nextPage: number) {
    const bounded = Math.min(Math.max(nextPage, 0), pages.length - 1);
    setPage(bounded);
    if (typeof window !== "undefined") window.localStorage.setItem(storageKey(bookId), String(bounded));
  }

  function toggleBookmark() {
    setBookmarkedPages((current) => {
      const next = current.includes(page) ? current.filter((item) => item !== page) : [...current, page].sort((a, b) => a - b);
      window.localStorage.setItem(bookmarkKey(bookId), JSON.stringify(next));
      return next;
    });
  }

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  }

  function toggleSpeech() {
    if (!window.speechSynthesis) {
      setToolResult("Text-to-speech is not supported in this browser.");
      return;
    }
    if (listening) {
      window.speechSynthesis.pause();
      setListening(false);
      return;
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setListening(true);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(currentPageText(pageText));
    utterance.rate = speechRate;
    utterance.voice = voices.find((voice) => voice.name === voiceName) ?? null;
    utterance.onend = () => setListening(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setListening(true);
  }

  function startVoiceSearch() {
    const Recognition = (window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ??
      (window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition;
    if (!Recognition) {
      setToolResult("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const query = event.results[0]?.[0]?.transcript;
      if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
    };
    recognition.onerror = () => setToolResult("Voice search could not hear a clear query.");
    recognition.start();
  }

  async function runAiTool(path: string, body: Record<string, string>, loadingLabel: string) {
    setToolLoading(loadingLabel);
    setToolResult("");
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(error?.message ?? "The reader assistant could not complete that request.");
      }
      const data = (await response.json()) as { message?: string; text?: string };
      setToolResult(data.text || data.message || "Done.");
    } catch (error) {
      setToolResult(error instanceof Error ? error.message : "The reader assistant could not complete that request.");
    } finally {
      setToolLoading("");
    }
  }

  async function handleOcr(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setToolLoading("Scanning image");
    setToolResult("");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read the image."));
        reader.readAsDataURL(file);
      });
      const [header, imageBase64] = dataUrl.split(",");
      const mimeType = header.match(/data:(.*);base64/)?.[1] ?? file.type;
      await runAiTool("/ai/ocr", { imageBase64, mimeType }, "Scanning image");
    } catch (error) {
      setToolResult(error instanceof Error ? error.message : "OCR failed.");
      setToolLoading("");
    } finally {
      event.target.value = "";
    }
  }

  function showSelectedPreview() {
    setToolLoading("");
    setShowPreview(true);
    const previewText = currentPageText(pageText) || book.description || "No preview text is available for this title.";
    setToolResult(`${book.title}\n\n${previewText}`);
  }

  const pageOptions = useMemo(() => Array.from({ length: pages.length }, (_, index) => index), [pages.length]);
  const fullBookHref = `/reader?book=${encodeURIComponent(book.id)}&mode=full`;
  const showReadFullBook = readerMode === "preview" && payload.isFullTextAvailable;

  return (
    <div className={fullscreen ? "fixed inset-0 z-[80] overflow-auto bg-[#FFF7ED] p-4" : ""}>
      <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <Card className="h-max p-4">
          <p className="mb-4 text-sm font-bold text-[#7B61FF]">Reading Controls</p>
          <div className="grid grid-cols-3 gap-2">
            {(["light", "sepia", "dark"] as ThemeName[]).map((item) => (
              <Button key={item} onClick={() => setTheme(item)} size="sm" type="button" variant={theme === item ? "glow" : "glass"}>
                {item}
              </Button>
            ))}
          </div>

          <label className="mt-5 block text-sm font-semibold">Chapter</label>
          <select className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white/70 px-3 font-semibold" onChange={(event) => go(Number(event.target.value))} value={chapters.find((chapter) => chapter.page <= page)?.page ?? 0}>
            {chapters.map((chapter) => <option key={`${chapter.title}-${chapter.page}`} value={chapter.page}>{chapter.title}</option>)}
          </select>

          <label className="mt-5 block text-sm font-semibold">Jump to page</label>
          <select className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white/70 px-3 font-semibold" onChange={(event) => go(Number(event.target.value))} value={page}>
            {pageOptions.map((item) => <option key={item} value={item}>Page {item + 1}</option>)}
          </select>

          <label className="mt-5 block text-sm font-semibold">Font size</label>
          <input className="mt-2 w-full accent-[#FF4ECD]" max="30" min="16" onChange={(event) => setFontSize(Number(event.target.value))} type="range" value={fontSize} />

          <label className="mt-5 block text-sm font-semibold">Line height</label>
          <input className="mt-2 w-full accent-[#7B61FF]" max="2.2" min="1.35" onChange={(event) => setLineHeight(Number(event.target.value))} step="0.05" type="range" value={lineHeight} />

          <label className="mt-5 block text-sm font-semibold">Brightness</label>
          <input className="mt-2 w-full accent-[#3AEFFF]" max="110" min="60" onChange={(event) => setBrightness(Number(event.target.value))} type="range" value={brightness} />

          <label className="mt-5 block text-sm font-semibold">Font family</label>
          <select className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white/70 px-3 font-semibold" onChange={(event) => setFontFamily(event.target.value)} value={fontFamily}>
            <option>Space Grotesk</option>
            <option>Georgia</option>
            <option>Inter</option>
            <option>Verdana</option>
          </select>

          <Button className="mt-5 w-full" onClick={toggleFullscreen} type="button" variant="glow">
            {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        </Card>

        <article className={`rounded-[8px] border border-black/10 p-7 shadow-2xl backdrop-blur-xl md:p-12 ${themes[theme]}`} style={{ filter: `brightness(${brightness}%)`, fontFamily }}>
          <div className="mb-6">
            <p className="text-sm font-bold text-[#FF4ECD]">{payload.readerMode === "preview" ? "Preview Reading Mode" : "Provider Reading Mode"}</p>
            <h1 className="mt-2 text-4xl font-black">{book.title}</h1>
            <p className="mt-2 text-sm font-bold opacity-70">{loadingBook ? "Loading selected book..." : book.author}</p>
            {bookError ? <p className="mt-3 rounded-[8px] bg-red-500/10 p-3 text-sm font-bold text-red-700">{bookError}</p> : null}
            {payload.message ? <p className="mt-3 rounded-[8px] bg-[#3AEFFF]/10 p-3 text-sm font-bold opacity-80">{payload.message}</p> : null}
            <div className="mt-3 flex flex-wrap gap-3">
              {readerMode === "full" && payload.fullTextUrl ? <a className="inline-flex text-sm font-bold text-[#7B61FF]" href={payload.fullTextUrl} rel="noreferrer" target="_blank">Open complete provider reader</a> : null}
              {payload.epubUrl ? <a className="inline-flex text-sm font-bold text-[#7B61FF]" href={`/reader/document?type=epub&url=${encodeURIComponent(payload.epubUrl)}`}>Read EPUB</a> : null}
              {payload.pdfUrl ? <a className="inline-flex text-sm font-bold text-[#7B61FF]" href={`/reader/document?type=pdf&url=${encodeURIComponent(payload.pdfUrl)}`}>Read PDF</a> : null}
              {payload.borrowUrl ? <a className="inline-flex text-sm font-bold text-[#7B61FF]" href={payload.borrowUrl} rel="noreferrer" target="_blank">Borrow Book</a> : null}
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FF7B54] via-[#FF4ECD] to-[#7B61FF]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-sm font-bold opacity-70">Page {page + 1} of {pages.length} · {progress}% complete</p>
          </div>

          <div className="space-y-6 transition-opacity duration-300" style={{ fontSize, lineHeight }}>
            {pageText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          {showReadFullBook ? (
            <div className="mt-10 border-t border-black/10 pt-5">
              <Button asChild type="button" variant="glow">
                <Link href={fullBookHref}>Read Full Book</Link>
              </Button>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-5">
            <div className="flex gap-2">
              <Button aria-label="First page" onClick={() => go(0)} size="icon" type="button" variant="glass"><ChevronsLeft size={18} /></Button>
              <Button disabled={page === 0} onClick={() => go(page - 1)} type="button" variant="glass">Previous</Button>
            </div>
            <Button onClick={toggleBookmark} type="button" variant={bookmarkedPages.includes(page) ? "glow" : "glass"}>
              <Bookmark size={17} /> {bookmarkedPages.includes(page) ? "Bookmarked" : "Bookmark Page"}
            </Button>
            <div className="flex gap-2">
              <Button disabled={page === pages.length - 1} onClick={() => go(page + 1)} type="button" variant="glass">Next</Button>
              <Button aria-label="Last page" onClick={() => go(pages.length - 1)} size="icon" type="button" variant="glass"><ChevronsRight size={18} /></Button>
            </div>
          </div>
        </article>

        <Card className="h-max p-4">
          <p className="mb-4 text-sm font-bold text-[#FF7B54]">AI Reading Assistant</p>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={toggleSpeech} size="sm" type="button" variant={listening ? "glow" : "glass"}><Volume2 size={15} /> {listening ? "Pause" : "Listen"}</Button>
            <Button onClick={startVoiceSearch} size="sm" type="button" variant="glass"><Mic size={15} /> Voice Search</Button>
            <Button onClick={() => fileInputRef.current?.click()} size="sm" type="button" variant="glass"><ScanText size={15} /> OCR Scan</Button>
            <Button onClick={() => runAiTool("/ai/translate", { text: selectedText || currentPageText(pageText), language }, "Translating")} size="sm" type="button" variant="glass"><Languages size={15} /> Translate</Button>
            <Button onClick={() => runAiTool("/ai/explain", { text: selectedText || pageText[0] || currentPageText(pageText) }, "Explaining")} size="sm" type="button" variant="glass"><Highlighter size={15} /> Explain</Button>
            <Button onClick={showSelectedPreview} size="sm" type="button" variant="glass"><Expand size={15} /> Preview</Button>
          </div>
          <input accept="image/*" className="hidden" onChange={handleOcr} ref={fileInputRef} type="file" />

          <label className="mt-5 block text-sm font-semibold">Speech speed</label>
          <input className="mt-2 w-full accent-[#FF4ECD]" max="1.8" min="0.7" onChange={(event) => setSpeechRate(Number(event.target.value))} step="0.1" type="range" value={speechRate} />

          <label className="mt-5 block text-sm font-semibold">Voice</label>
          <select className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white/70 px-3 font-semibold" onChange={(event) => setVoiceName(event.target.value)} value={voiceName}>
            <option value="">Default voice</option>
            {voices.map((voice) => <option key={voice.name} value={voice.name}>{voice.name}</option>)}
          </select>

          <label className="mt-5 block text-sm font-semibold">Translate to</label>
          <select className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white/70 px-3 font-semibold" onChange={(event) => setLanguage(event.target.value)} value={language}>
            {["Hindi", "Spanish", "French", "German", "Tamil", "Bengali", "Japanese"].map((item) => <option key={item}>{item}</option>)}
          </select>

          <div className="mt-5 rounded-[8px] bg-[#1E1E1E] p-4 text-sm leading-6 text-[#FFF7ED]">
            {toolLoading ? `${toolLoading}...` : toolResult || "Select text or use the current page with Listen, Translate, Explain, OCR, and Preview."}
          </div>

          {showPreview ? (
            <div className="mt-4 rounded-[8px] border border-black/10 bg-white/70 p-4 text-sm leading-6">
              <p className="font-black">{book.title}</p>
              <p className="font-semibold text-[#766f6a]">{book.author}</p>
              <p className="mt-3">{book.description}</p>
              <p className="mt-3 font-bold text-[#7B61FF]">{book.genre} · {book.rating.toFixed(1)} · {payload.readerMode}</p>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
