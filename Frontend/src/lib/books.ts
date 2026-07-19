import { featuredBooks } from "@/lib/content";
import { apiFetch } from "@/lib/api";
import type { Book } from "@/types/book";

type ApiBook = {
  id: string;
  title?: string;
  authors?: string[];
  description?: string;
  categories?: string[];
  thumbnail?: string | null;
  coverCandidates?: string[];
  rating?: number | null;
  previewLink?: string | null;
  webReaderLink?: string | null;
  viewability?: string;
  embeddable?: boolean;
  publicDomain?: boolean;
  textToSpeechPermission?: string;
  isFullTextAvailable?: boolean;
  fullTextSource?: string;
  readingSource?: Book["readingSource"];
  language?: string;
};

const coverGradients = [
  "linear-gradient(145deg, #3AEFFF, #7B61FF)",
  "linear-gradient(145deg, #7B61FF, #FF4ECD)",
  "linear-gradient(145deg, #1E1E1E, #FF7B54)",
  "linear-gradient(145deg, #FF7B54, #FF4ECD)"
];

function normalizeBook(book: ApiBook, index = 0): Book {
  const categories = book.categories?.length ? book.categories : ["General"];
  const authors = book.authors?.length ? book.authors : ["Unknown author"];

  const description = sanitizeDescription(book.description);

  return {
    id: book.id,
    title: book.title ?? "Untitled volume",
    author: authors.join(", "),
    authors,
    genre: categories[0],
    categories,
    mood: categories[0],
    rating: book.rating ?? 4.4,
    cover: coverGradients[index % coverGradients.length],
    thumbnail: sharpenCover(book.thumbnail),
    coverCandidates: [book.thumbnail, ...(book.coverCandidates ?? [])].map(sharpenCover).filter(Boolean) as string[],
    previewLink: book.previewLink ?? null,
    webReaderLink: book.webReaderLink ?? null,
    viewability: book.viewability ?? "UNKNOWN",
    embeddable: book.embeddable ?? false,
    publicDomain: book.publicDomain ?? false,
    textToSpeechPermission: book.textToSpeechPermission ?? "UNKNOWN",
    isFullTextAvailable: book.isFullTextAvailable ?? false,
    fullTextSource: book.fullTextSource,
    readingSource: book.readingSource,
    language: book.language ?? "en",
    description
  };
}

function sanitizeDescription(description?: string) {
  if (!description) return "No description yet. The best pages may still be ahead.";
  return description
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function sharpenCover(url?: string | null) {
  if (!url) return null;
  return url
    .replace("http://", "https://")
    .replace("zoom=1", "zoom=0")
    .replace("&edge=curl", "")
    .replace("?edge=curl&", "?");
}

async function fetchBooks(path: string, fallback = featuredBooks): Promise<Book[]> {
  try {
    const response = await apiFetch(path, { next: { revalidate: 900 } });
    const data = (await response.json()) as { books?: ApiBook[] };
    const books = data.books?.map(normalizeBook) ?? [];
    return books.length ? books : fallback;
  } catch (error) {
    console.warn("Falling back to local featured books.", error);
    return fallback;
  }
}

export function getTrendingBooks() {
  return fetchBooks("/books/trending");
}

export function searchBooks(query: string, page = 0) {
  const params = new URLSearchParams({
    q: query.trim() || "fiction",
    startIndex: String(page * 20),
    maxResults: "20"
  });
  return fetchBooks(`/books/search?${params}`);
}

export function getCategoryBooks(category: string) {
  const slug = category.toLowerCase().replaceAll(" ", "-");
  return fetchBooks(`/books/genres/${encodeURIComponent(slug)}?maxResults=30`);
}

export async function getBook(id: string): Promise<Book | null> {
  const local = featuredBooks.find((book) => book.id === id);
  try {
    const response = await apiFetch(`/books/${encodeURIComponent(id)}`, { next: { revalidate: 900 } });
    const data = (await response.json()) as { book?: ApiBook };
    return data.book ? normalizeBook(data.book) : local ?? null;
  } catch {
    return local ?? null;
  }
}
