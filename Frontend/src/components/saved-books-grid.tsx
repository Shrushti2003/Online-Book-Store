"use client";

import { useEffect, useState } from "react";
import { BookCard } from "@/components/book-card";
import type { Book } from "@/types/book";

export function SavedBooksGrid({ storageKey, emptyText }: { storageKey: string; emptyText: string }) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setBooks(JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as Book[]);
      } catch {
        setBooks([]);
      }
    });
  }, [storageKey]);

  if (!books.length) {
    return (
      <div className="rounded-[8px] border border-dashed border-black/20 bg-white/48 p-8 text-center font-bold text-[#766f6a]">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {books.map((book, index) => <BookCard key={book.id} book={book} index={index} />)}
    </div>
  );
}
