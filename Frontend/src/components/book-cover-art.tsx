"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Book } from "@/types/book";

export function BookCoverArt({ book, priority = false }: { book: Book; priority?: boolean }) {
  const candidates = useMemo(() => [book.thumbnail, ...(book.coverCandidates ?? [])].filter(Boolean) as string[], [book.coverCandidates, book.thumbnail]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const currentCover = candidates[candidateIndex] ?? null;
  const fallbackWords = book.title.split(/\s+/).slice(0, 4).join(" ");

  if (currentCover) {
    return (
      <Image
        alt={`${book.title} cover`}
        className="object-cover"
        fill
        onError={() => setCandidateIndex((value) => value + 1)}
        priority={priority}
        sizes="(min-width: 1024px) 360px, 80vw"
        src={currentCover}
      />
    );
  }

  return (
    <div className="grid h-full place-items-end p-8 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,.34),transparent_32%,rgba(255,255,255,.16)_70%,transparent)] opacity-80" />
      <div className="relative">
        <p className="mb-3 text-sm font-bold uppercase tracking-[.2em] opacity-75">{book.genre}</p>
        <h1 className="text-5xl font-black leading-none">{fallbackWords}</h1>
        <p className="mt-4 text-lg font-semibold opacity-80">{book.author}</p>
      </div>
    </div>
  );
}
