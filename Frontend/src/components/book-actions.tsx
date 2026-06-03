"use client";

import { Bookmark, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book";

const WISHLIST_KEY = "lumibooks:wishlist";
const HISTORY_KEY = "lumibooks:history";

function readBooks(key: string): Book[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as Book[];
  } catch {
    return [];
  }
}

function writeBooks(key: string, books: Book[]) {
  window.localStorage.setItem(key, JSON.stringify(books));
}

export function BookActions({ book }: { book: Book }) {
  const [saved, setSaved] = useState(false);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    const history = readBooks(HISTORY_KEY).filter((item) => item.id !== book.id);
    writeBooks(HISTORY_KEY, [book, ...history].slice(0, 20));
    queueMicrotask(() => {
      setSaved(readBooks(WISHLIST_KEY).some((item) => item.id === book.id));
      setTracked(true);
    });
  }, [book]);

  function toggleWishlist() {
    const current = readBooks(WISHLIST_KEY);
    const exists = current.some((item) => item.id === book.id);
    const next = exists ? current.filter((item) => item.id !== book.id) : [book, ...current];
    writeBooks(WISHLIST_KEY, next);
    setSaved(!exists);
  }

  return (
    <>
      <Button onClick={toggleWishlist} variant="glass">
        {saved ? <Check size={18} /> : <Bookmark size={18} />}
        {saved ? "Saved" : "Add to Wishlist"}
      </Button>
      <Button variant="glass">
        <Clock size={18} /> {tracked ? "History Updated" : "Track View"}
      </Button>
    </>
  );
}
