import { asyncHandler } from "../utils/async-handler.js";
import {
  getDiverseTrendingBooks,
  getGoogleBook,
  getGoogleBookReadingPayload,
  searchGoogleBooks,
  smartSearchGoogleBooks
} from "../services/google-books-service.js";

const genreQueries = {
  fiction: "subject:fiction",
  fantasy: "subject:fantasy",
  romance: "subject:romance",
  mystery: "subject:mystery",
  business: "subject:business",
  "self-help": "subject:self-help",
  technology: "subject:technology",
  "sci-fi": "subject:science fiction",
  horror: "subject:horror",
  biography: "subject:biography",
  philosophy: "subject:philosophy"
};

export const searchBooks = asyncHandler(async (req, res) => {
  const query = req.query.q?.toString() || "cinematic fiction";
  const startIndex = Number(req.query.startIndex ?? 0);
  const maxResults = Math.min(Number(req.query.maxResults ?? 20), 40);
  const books = await smartSearchGoogleBooks(query, { startIndex, maxResults });
  res.json({ books });
});

export const getTrendingBooks = asyncHandler(async (req, res) => {
  const maxResults = Math.min(Number(req.query.maxResults ?? 36), 54);
  const books = await getDiverseTrendingBooks({ maxResults });
  res.json({ books });
});

export const getGenreBooks = asyncHandler(async (req, res) => {
  const slug = req.params.genre?.toString().toLowerCase();
  const query = genreQueries[slug] ?? `subject:${slug.replaceAll("-", " ")}`;
  const startIndex = Number(req.query.startIndex ?? 0);
  const maxResults = Math.min(Number(req.query.maxResults ?? 30), 40);
  const books = await searchGoogleBooks(query, { startIndex, maxResults, orderBy: "relevance" });
  res.json({ genre: slug, books });
});

export const getBookById = asyncHandler(async (req, res) => {
  const book = await getGoogleBook(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found." });
  res.json({ book });
});

export const getBookReadingPayload = asyncHandler(async (req, res) => {
  const payload = await getGoogleBookReadingPayload(req.params.id, { mode: req.query.mode?.toString() ?? "preview" });
  if (!payload) return res.status(404).json({ message: "Book not found." });
  res.json(payload);
});
