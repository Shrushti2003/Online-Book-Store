"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookCard } from "@/components/book-card";
import type { Book } from "@/types/book";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type ApiBook = {
  id: string;
  title?: string;
  authors?: string[];
  categories?: string[];
  thumbnail?: string | null;
  coverCandidates?: string[];
  rating?: number | null;
  previewLink?: string | null;
  webReaderLink?: string | null;
  viewability?: string;
  language?: string;
  description?: string;
  isFullTextAvailable?: boolean;
  fullTextSource?: string;
  readingSource?: Book["readingSource"];
};

function sanitizeDescription(description?: string) {
  if (!description) return "No description yet.";
  return description.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function normalize(book: ApiBook, index: number): Book {
  const categories = book.categories?.length ? book.categories : ["General"];
  const authors = book.authors?.length ? book.authors : ["Unknown author"];
  return {
    id: book.id,
    title: book.title ?? "Untitled volume",
    author: authors.join(", "),
    authors,
    genre: categories[0],
    categories,
    mood: categories[0],
    rating: book.rating ?? 4.4,
    cover: ["linear-gradient(145deg, #3AEFFF, #7B61FF)", "linear-gradient(145deg, #7B61FF, #FF4ECD)", "linear-gradient(145deg, #1E1E1E, #FF7B54)"][index % 3],
    thumbnail: book.thumbnail?.replace("zoom=1", "zoom=0").replace("&edge=curl", ""),
    coverCandidates: [book.thumbnail, ...(book.coverCandidates ?? [])].filter(Boolean) as string[],
    previewLink: book.previewLink,
    webReaderLink: book.webReaderLink,
    viewability: book.viewability,
    language: book.language,
    isFullTextAvailable: book.isFullTextAvailable,
    fullTextSource: book.fullTextSource,
    readingSource: book.readingSource,
    description: sanitizeDescription(book.description)
  };
}

export function SearchResults({ initialBooks, initialQuery = "fiction" }: { initialBooks: Book[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const searchPath = useMemo(() => {
    const q = genre ? `subject:${genre}` : query;
    return `/books/search?q=${encodeURIComponent(q)}&maxResults=30`;
  }, [genre, query]);
  const { data, isFetching } = useQuery({
    queryKey: ["books", query, genre],
    queryFn: async () => {
      const response = await fetch(`${API_URL}${searchPath}`);
      if (!response.ok) throw new Error("Search failed");
      const payload = await response.json();
      return (payload.books ?? []).map(normalize) as Book[];
    },
    initialData: initialBooks,
    staleTime: 60_000
  });
  const sortedBooks = useMemo(() => {
    const books = [...data];
    if (sortBy === "rating") return books.sort((a, b) => b.rating - a.rating);
    if (sortBy === "title") return books.sort((a, b) => a.title.localeCompare(b.title));
    return books;
  }, [data, sortBy]);

  return (
    <>
      <div className="mt-6 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 bg-white/62 px-4 transition focus-within:border-[#7B61FF]">
        <Search className="text-[#7B61FF]" />
        <input
          className="h-full flex-1 bg-transparent outline-none"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find books, moods, authors, characters, or a sentence you cannot forget..."
          value={query}
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <select className="h-12 rounded-[8px] border border-black/10 bg-white/62 px-4 font-semibold outline-none" onChange={(event) => setGenre(event.target.value)} value={genre}>
          <option value="">All categories</option>
          {["fiction", "fantasy", "romance", "mystery", "business", "self-help", "technology", "science fiction", "horror", "biography", "philosophy"].map((item) => (
            <option key={item} value={item}>{item.replace(/\b\w/g, (letter) => letter.toUpperCase())}</option>
          ))}
        </select>
        <select className="h-12 rounded-[8px] border border-black/10 bg-white/62 px-4 font-semibold outline-none" onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
          <option value="relevance">Sort by relevance</option>
          <option value="rating">Sort by rating</option>
          <option value="title">Sort by title</option>
        </select>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isFetching
          ? Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-[8px] bg-white/60" />)
          : sortedBooks.map((book, index) => <BookCard key={book.id} book={book} index={index} />)}
      </div>
    </>
  );
}
