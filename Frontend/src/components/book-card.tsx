"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Star } from "lucide-react";
import { useMemo, useState } from "react";
import type { Book } from "@/types/book";

function readingAvailability(book: Book) {
  if (book.isFullTextAvailable || book.readingSource?.fullTextAvailable) return { label: "Full Access", tone: "text-[#7B61FF]" };
  if (book.readingSource?.licensedAccessAvailable || book.viewability === "NO_PAGES") return { label: "Publisher Restricted", tone: "text-[#FF7B54]" };
  if (book.viewability === "PARTIAL" || book.previewLink || book.webReaderLink) return { label: "Limited Preview", tone: "text-[#766f6a]" };
  return { label: "Full Text Unavailable", tone: "text-[#FF7B54]" };
}

export function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  const candidates = useMemo(() => [book.thumbnail, ...(book.coverCandidates ?? [])].filter(Boolean) as string[], [book.coverCandidates, book.thumbnail]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const currentCover = candidates[candidateIndex] ?? null;
  const fallbackWords = book.title.split(/\s+/).slice(0, 4).join(" ");
  const availability = readingAvailability(book);

  return (
    <Link
      href={`/books/${book.id}`}
      className="group magnetic block rounded-[8px] border border-black/10 bg-white/48 p-3 backdrop-blur-xl"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="book-spine relative mb-4 aspect-[3/4] overflow-hidden rounded-[8px] text-white shadow-2xl" style={{ background: book.cover }}>
        {currentCover ? (
          <Image
            alt={`${book.title} cover`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            fill
            onError={() => setCandidateIndex((value) => value + 1)}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={currentCover}
          />
        ) : (
          <div className="grid h-full place-items-end p-4">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,.34),transparent_32%,rgba(255,255,255,.16)_70%,transparent)] opacity-80" />
            <div className="relative">
              <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] opacity-75">{book.genre}</p>
              <span className="text-2xl font-black leading-none">{fallbackWords}</span>
              <p className="mt-3 text-sm font-semibold opacity-80">{book.author}</p>
            </div>
          </div>
        )}
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-[#1E1E1E] opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100">
          <Bookmark size={16} />
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 font-bold">{book.title}</h3>
          <span className="flex items-center gap-1 text-xs font-bold text-[#FF7B54]">
            <Star size={13} fill="currentColor" /> {book.rating}
          </span>
        </div>
        <p className="text-sm text-[#766f6a]">{book.author}</p>
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#7B61FF]">{book.genre}</p>
        <p className={`text-xs font-bold uppercase tracking-[.18em] ${availability.tone}`}>{availability.label}</p>
        <p className="line-clamp-2 text-sm text-[#1E1E1E]/68">{book.description}</p>
      </div>
    </Link>
  );
}
