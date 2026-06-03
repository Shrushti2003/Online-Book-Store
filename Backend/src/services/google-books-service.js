import { getRedis } from "../config/redis.js";
import { env } from "../config/env.js";

const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";
const GUTENDEX_URL = "https://gutendex.com/books";
const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const trendingSubjects = [
  "fiction",
  "fantasy",
  "romance",
  "mystery",
  "thriller",
  "science fiction",
  "philosophy",
  "business",
  "psychology",
  "self-help",
  "biography",
  "history",
  "technology",
  "artificial intelligence",
  "data science",
  "finance",
  "productivity",
  "entrepreneurship"
];

function sanitizeText(value, fallback = "") {
  if (!value) return fallback;
  return String(value)
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

function imageQualityRank(url = "") {
  if (!url) return 0;
  if (url.includes("books.google.com") && url.includes("zoom=0")) return 10;
  if (url.includes("books.google.com")) return 8;
  if (url.includes("covers.openlibrary.org")) return 6;
  if (url.includes("extraLarge")) return 7;
  if (url.includes("large")) return 6;
  return 4;
}

function sharpenCover(url) {
  if (!url) return null;
  return url
    .replace("http://", "https://")
    .replace("zoom=1", "zoom=0")
    .replace("&edge=curl", "")
    .replace("?edge=curl&", "?");
}

function identifiers(volume) {
  return (volume.industryIdentifiers ?? [])
    .map((item) => item.identifier)
    .filter(Boolean);
}

function coverCandidates(volume) {
  const ids = identifiers(volume);
  const imageLinks = volume.imageLinks ?? {};
  const googleImages = [
    imageLinks.extraLarge,
    imageLinks.large,
    imageLinks.medium,
    imageLinks.small,
    imageLinks.thumbnail,
    imageLinks.smallThumbnail
  ].map(sharpenCover);
  const openLibraryImages = ids.map((id) => `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(id)}-L.jpg?default=false`);

  return [...googleImages, ...openLibraryImages]
    .filter(Boolean)
    .filter((url, index, all) => all.indexOf(url) === index)
    .sort((a, b) => imageQualityRank(b) - imageQualityRank(a));
}

function normalizeBook(item) {
  const volume = item.volumeInfo ?? {};
  const candidates = coverCandidates(volume);
  const categories = volume.categories ?? ["General"];

  return {
    id: item.id,
    title: volume.title ?? "Untitled volume",
    authors: volume.authors ?? ["Unknown author"],
    description: sanitizeText(volume.description, "No description yet. The best pages may still be ahead."),
    categories,
    identifiers: identifiers(volume),
    thumbnail: candidates[0] ?? null,
    coverCandidates: candidates,
    rating: volume.averageRating ?? null,
    ratingsCount: volume.ratingsCount ?? 0,
    publishedDate: volume.publishedDate ?? null,
    previewLink: volume.previewLink ?? null,
    webReaderLink: item.accessInfo?.webReaderLink ?? null,
    viewability: item.accessInfo?.viewability ?? "UNKNOWN",
    embeddable: Boolean(item.accessInfo?.embeddable),
    publicDomain: Boolean(item.accessInfo?.publicDomain),
    textToSpeechPermission: item.accessInfo?.textToSpeechPermission ?? "UNKNOWN",
    pdf: item.accessInfo?.pdf ?? null,
    epub: item.accessInfo?.epub ?? null,
    language: volume.language ?? "en",
    relevanceScore: 0
  };
}

async function requestGoogleBooks(url, attempts = 2) {
  let lastError;
  for (let attempt = 0; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      lastError = new Error(`Google Books returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  throw lastError;
}

async function requestJson(url, attempts = 1) {
  let lastError;
  for (let attempt = 0; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (response.ok) return response.json();
      lastError = new Error(`Request returned ${response.status}`);
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  throw lastError;
}

async function requestText(url, attempts = 1) {
  let lastError;
  for (let attempt = 0; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (response.ok) return response.text();
      lastError = new Error(`Request returned ${response.status}`);
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
  }
  throw lastError;
}

export async function searchGoogleBooks(query, { startIndex = 0, maxResults = 20, orderBy = "relevance" } = {}) {
  const cacheKey = `books:${query}:${startIndex}:${maxResults}:${orderBy}`;
  const redis = getRedis();
  const cached = redis ? await redis.get(cacheKey) : null;
  if (cached) return JSON.parse(cached);

  const params = new URLSearchParams({
    q: query,
    startIndex: String(startIndex),
    maxResults: String(maxResults),
    orderBy
  });
  if (env.googleBooksApiKey) params.set("key", env.googleBooksApiKey);

  const data = await requestGoogleBooks(`${GOOGLE_BOOKS_URL}?${params}`);
  const books = (data.items ?? []).map(normalizeBook);

  if (redis) await redis.set(cacheKey, JSON.stringify(books), "EX", 60 * 15);
  return books;
}

function scoreBook(book, query = "") {
  const normalized = query.toLowerCase().replace(/^subject:/, "").trim();
  const title = book.title.toLowerCase();
  const authors = book.authors.join(" ").toLowerCase();
  const categories = book.categories.join(" ").toLowerCase();
  let score = 0;
  if (title === normalized) score += 80;
  if (title.includes(normalized)) score += 45;
  if (authors.includes(normalized)) score += 25;
  if (categories.includes(normalized)) score += 20;
  if (book.thumbnail) score += 18;
  score += Math.min(book.ratingsCount ?? 0, 5000) / 500;
  score += book.rating ? book.rating * 2 : 0;
  return score;
}

export async function smartSearchGoogleBooks(query, { startIndex = 0, maxResults = 20 } = {}) {
  const cleaned = sanitizeText(query, "fiction");
  const cacheKey = `books:smart:${cleaned}:${startIndex}:${maxResults}`;
  const redis = getRedis();
  const cached = redis ? await redis.get(cacheKey) : null;
  if (cached) return JSON.parse(cached);

  const queries = cleaned.startsWith("subject:")
    ? [cleaned]
    : [cleaned, `intitle:${cleaned}`, `inauthor:${cleaned}`];
  const results = await Promise.allSettled(
    queries.map((item) => searchGoogleBooks(item, { startIndex, maxResults, orderBy: "relevance" }))
  );
  const unique = new Map();
  results.forEach((result) => {
    if (result.status !== "fulfilled") return;
    result.value.forEach((book) => {
      if (!unique.has(book.id)) unique.set(book.id, book);
    });
  });
  const books = [...unique.values()]
    .map((book) => ({ ...book, relevanceScore: scoreBook(book, cleaned) }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
  const enriched = await enrichBooksWithReadableSources(books, cleaned);

  if (redis) await redis.set(cacheKey, JSON.stringify(enriched), "EX", 60 * 15);
  return enriched;
}

export async function getDiverseTrendingBooks({ maxResults = 36 } = {}) {
  const cacheKey = `books:trending:diverse:${maxResults}`;
  const redis = getRedis();
  const cached = redis ? await redis.get(cacheKey) : null;
  if (cached) return JSON.parse(cached);

  const perSubject = Math.max(2, Math.ceil(maxResults / trendingSubjects.length));
  const settled = await Promise.allSettled(
    trendingSubjects.map((subject) => searchGoogleBooks(`subject:${subject}`, { maxResults: perSubject, orderBy: "relevance" }))
  );
  const unique = new Map();
  settled.forEach((result) => {
    if (result.status !== "fulfilled") return;
    result.value.forEach((book) => {
      if (!unique.has(book.id)) unique.set(book.id, book);
    });
  });
  const books = [...unique.values()]
    .sort((a, b) => {
      const scoreA = (a.rating ?? 4.2) * 8 + Math.min(a.ratingsCount ?? 0, 10000) / 700 + (a.thumbnail ? 8 : 0);
      const scoreB = (b.rating ?? 4.2) * 8 + Math.min(b.ratingsCount ?? 0, 10000) / 700 + (b.thumbnail ? 8 : 0);
      return scoreB - scoreA;
    })
    .slice(0, maxResults);

  if (redis) await redis.set(cacheKey, JSON.stringify(books), "EX", 60 * 20);
  return books;
}

function chunkText(text, size = 650) {
  const words = sanitizeText(text).split(/\s+/).filter(Boolean);
  const pages = [];
  for (let index = 0; index < words.length; index += size) {
    pages.push([words.slice(index, index + size).join(" ")]);
  }
  return pages.length ? pages : [["This publisher has not exposed readable text through the configured APIs."]];
}

function titleWords(value) {
  return sanitizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function normalizeIsbn(value = "") {
  return String(value).replace(/[^0-9Xx]/g, "").toUpperCase();
}

function sameBookByText(book, candidateTitle, candidateAuthors = "") {
  const wantedTitle = titleWords(book.title).slice(0, 5);
  const wantedAuthor = titleWords(book.authors?.[0] ?? "").slice(0, 3);
  const itemTitle = titleWords(candidateTitle);
  const itemAuthors = titleWords(candidateAuthors);
  const titleScore = wantedTitle.filter((word) => itemTitle.includes(word)).length;
  const authorScore = wantedAuthor.length ? wantedAuthor.filter((word) => itemAuthors.includes(word)).length : 1;
  return titleScore >= Math.min(2, wantedTitle.length) && authorScore >= Math.min(1, wantedAuthor.length || 1);
}

function gutenbergTextUrl(formats = {}) {
  return (
    formats["text/plain; charset=utf-8"] ??
    formats["text/plain; charset=us-ascii"] ??
    formats["text/plain"] ??
    Object.entries(formats).find(([type]) => type.startsWith("text/plain"))?.[1] ??
    null
  );
}

function gutendexFormatUrls(formats = {}) {
  return {
    textUrl: gutenbergTextUrl(formats),
    epubUrl: formats["application/epub+zip"] ?? null,
    pdfUrl: formats["application/pdf"] ?? null,
    htmlUrl:
      formats["text/html; charset=utf-8"] ??
      formats["text/html"] ??
      Object.entries(formats).find(([type]) => type.startsWith("text/html"))?.[1] ??
      null
  };
}

const canonicalPublicDomainSources = [
  {
    titleWords: ["sherlock", "holmes"],
    authorWords: ["doyle"],
    id: "1661",
    title: "The Adventures of Sherlock Holmes"
  },
  {
    titleWords: ["oliver", "twist"],
    authorWords: ["dickens"],
    id: "730",
    title: "Oliver Twist"
  },
  {
    titleWords: ["dracula"],
    authorWords: ["stoker"],
    id: "345",
    title: "Dracula"
  },
  {
    titleWords: ["pride", "prejudice"],
    authorWords: ["austen"],
    id: "1342",
    title: "Pride and Prejudice"
  },
  {
    titleWords: ["jane", "eyre"],
    authorWords: ["bronte"],
    id: "1260",
    title: "Jane Eyre"
  },
  {
    titleWords: ["treasure", "island"],
    authorWords: ["stevenson"],
    id: "120",
    title: "Treasure Island"
  }
];

function canonicalPublicDomainSource(book) {
  const bookTitleWords = titleWords(book.title);
  const bookAuthorWords = titleWords(book.authors?.join(" ") ?? "");
  const source = canonicalPublicDomainSources.find((item) => (
    item.titleWords.every((word) => bookTitleWords.includes(word)) &&
    item.authorWords.some((word) => bookAuthorWords.includes(word))
  ));
  if (!source) return null;
  return {
    title: source.title,
    textUrl: `https://www.gutenberg.org/ebooks/${source.id}.txt.utf-8`,
    htmlUrl: `https://www.gutenberg.org/ebooks/${source.id}.html.images`,
    epubUrl: `https://www.gutenberg.org/ebooks/${source.id}.epub3.images`,
    pdfUrl: null
  };
}

function sourceFromGutendexResult(result) {
  const urls = gutendexFormatUrls(result.formats ?? {});
  return {
    provider: "gutendex",
    label: "Project Gutenberg",
    fullTextAvailable: Boolean(urls.textUrl || urls.htmlUrl || urls.epubUrl || urls.pdfUrl),
    sourceId: String(result.id),
    readUrl: urls.textUrl ?? urls.htmlUrl,
    ...urls
  };
}

function sourceFromOpenLibraryDoc(doc) {
  const edition = doc.lending_edition_s ?? doc.cover_edition_key ?? doc.edition_key?.[0] ?? null;
  const workUrl = doc.key ? `https://openlibrary.org${doc.key}` : null;
  const readUrl = edition ? `https://openlibrary.org/books/${edition}/read` : workUrl;
  const borrowUrl = edition ? `https://openlibrary.org/books/${edition}/borrow` : workUrl;
  return {
    provider: "open-library",
    label: "Open Library",
    fullTextAvailable: false,
    licensedAccessAvailable: Boolean(doc.has_fulltext || doc.ebook_access === "public" || doc.ebook_access === "borrowable" || edition),
    borrowAvailable: Boolean(doc.ebook_access === "borrowable" || edition),
    sourceId: edition ?? doc.key,
    readUrl,
    borrowUrl
  };
}

function matchGutendexResult(book, result) {
  const resultIsbns = new Set([...(result.formats ? [] : []), ...(result.subjects ?? [])].map(normalizeIsbn));
  const bookIsbns = new Set((book.identifiers ?? []).map(normalizeIsbn));
  if ([...resultIsbns].some((id) => id && bookIsbns.has(id))) return true;
  return sameBookByText(book, result.title, (result.authors ?? []).map((entry) => entry.name).join(" "));
}

function matchOpenLibraryDoc(book, doc) {
  const bookIsbns = new Set((book.identifiers ?? []).map(normalizeIsbn));
  const docIsbns = new Set((doc.isbn ?? []).map(normalizeIsbn));
  if ([...docIsbns].some((id) => id && bookIsbns.has(id))) return true;
  return sameBookByText(book, doc.title, (doc.author_name ?? []).join(" "));
}

async function searchGutendex(query) {
  const cacheKey = `gutendex:search:${query}`;
  const redis = getRedis();
  const cached = redis ? await redis.get(cacheKey) : null;
  if (cached) return JSON.parse(cached);
  const params = new URLSearchParams({ search: query });
  const data = await requestJson(`${GUTENDEX_URL}?${params}`, 1);
  const results = data.results ?? [];
  if (redis) await redis.set(cacheKey, JSON.stringify(results), "EX", 60 * 60 * 12);
  return results;
}

async function searchOpenLibrary(query) {
  const cacheKey = `openlibrary:search:${query}`;
  const redis = getRedis();
  const cached = redis ? await redis.get(cacheKey) : null;
  if (cached) return JSON.parse(cached);
  const params = new URLSearchParams({ q: query, limit: "25" });
  const data = await requestJson(`${OPEN_LIBRARY_SEARCH_URL}?${params}`, 1);
  const docs = data.docs ?? [];
  if (redis) await redis.set(cacheKey, JSON.stringify(docs), "EX", 60 * 60 * 12);
  return docs;
}

async function enrichBooksWithReadableSources(books, query) {
  const canonicalById = new Map();
  books.forEach((book) => {
    const source = canonicalPublicDomainSource(book);
    if (source) canonicalById.set(book.id, source);
  });
  const needsProviderLookup = books.some((book) => !canonicalById.has(book.id));
  let gutendexResults = [];
  let openLibraryDocs = [];
  if (needsProviderLookup) {
    await Promise.race([
      Promise.allSettled([
        searchGutendex(query).then((results) => {
          gutendexResults = results;
        }),
        searchOpenLibrary(query).then((docs) => {
          openLibraryDocs = docs;
        })
      ]),
      new Promise((resolve) => setTimeout(resolve, 8000))
    ]);
  }

  return books.map((book) => {
    const canonicalSource = canonicalById.get(book.id);
    if (canonicalSource) {
      return {
        ...book,
        readingSource: {
          provider: "project-gutenberg",
          label: "Project Gutenberg",
          fullTextAvailable: true,
          readUrl: canonicalSource.textUrl,
          epubUrl: canonicalSource.epubUrl,
          pdfUrl: canonicalSource.pdfUrl,
          htmlUrl: canonicalSource.htmlUrl
        },
        isFullTextAvailable: true,
        fullTextSource: "Project Gutenberg"
      };
    }
    const gutendex = gutendexResults.find((result) => matchGutendexResult(book, result));
    if (gutendex) {
      const source = sourceFromGutendexResult(gutendex);
      return { ...book, readingSource: source, isFullTextAvailable: source.fullTextAvailable, fullTextSource: source.label };
    }
    const openLibrary = openLibraryDocs.find((doc) => matchOpenLibraryDoc(book, doc));
    if (openLibrary) {
      const source = sourceFromOpenLibraryDoc(openLibrary);
      return { ...book, readingSource: source, isFullTextAvailable: false, fullTextSource: source.licensedAccessAvailable ? source.label : undefined };
    }
    return book;
  });
}

function cleanGutenbergText(text) {
  const startPatterns = [
    "*** START OF THE PROJECT GUTENBERG EBOOK",
    "*** START OF THIS PROJECT GUTENBERG EBOOK"
  ];
  const endPatterns = [
    "*** END OF THE PROJECT GUTENBERG EBOOK",
    "*** END OF THIS PROJECT GUTENBERG EBOOK"
  ];
  let cleaned = text;
  const upper = text.toUpperCase();
  const startIndex = startPatterns
    .map((pattern) => upper.indexOf(pattern))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  if (startIndex >= 0) {
    const afterLine = text.indexOf("\n", startIndex);
    cleaned = text.slice(afterLine >= 0 ? afterLine + 1 : startIndex);
  }
  const cleanedUpper = cleaned.toUpperCase();
  const endIndex = endPatterns
    .map((pattern) => cleanedUpper.indexOf(pattern))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  if (endIndex >= 0) cleaned = cleaned.slice(0, endIndex);
  return cleaned.replace(/\r/g, "").replace(/\n{4,}/g, "\n\n\n").trim();
}

function chaptersFromText(text, pages) {
  const chapterMatches = [...text.matchAll(/(?:^|\n)(chapter\s+(?:[ivxlcdm]+|\d+)[^\n]*)/gi)].slice(0, 80);
  if (!chapterMatches.length) return pages.map((_page, index) => ({ title: index === 0 ? "Start" : `Page ${index + 1}`, page: index }));
  const wordsBefore = (offset) => text.slice(0, offset).split(/\s+/).filter(Boolean).length;
  return chapterMatches.map((match, index) => ({
    title: sanitizeText(match[1], `Chapter ${index + 1}`).slice(0, 80),
    page: Math.min(Math.floor(wordsBefore(match.index ?? 0) / 650), Math.max(pages.length - 1, 0))
  }));
}

async function getPublicDomainFullText(book) {
  const author = book.authors?.[0] ?? "";
  const cacheKey = `book:fulltext:${book.id}`;
  const redis = getRedis();
  const cached = redis ? await redis.get(cacheKey) : null;
  if (cached) return JSON.parse(cached);

  let canonicalSource = canonicalPublicDomainSource(book);
  let result = null;
  if (!canonicalSource) {
    const fallbackTitle = titleWords(book.title).slice(0, 4).join(" ");
    const queries = [
      [book.title, author].filter(Boolean).join(" "),
      book.title,
      fallbackTitle
    ].filter(Boolean).filter((item, index, all) => all.indexOf(item) === index);
    for (const query of queries) {
      const results = await searchGutendex(query);
      result = results.find((item) => matchGutendexResult(book, item));
      if (result) break;
    }
  }
  const urls = result ? gutendexFormatUrls(result.formats) : canonicalSource ?? {};
  const textUrl = urls.textUrl;
  if (!textUrl) return null;

  const text = cleanGutenbergText(await requestText(textUrl, 1));
  if (text.split(/\s+/).length < 500) return null;

  const pages = chunkText(text);
  const payload = {
    source: result ? "Project Gutenberg via Gutendex" : "Project Gutenberg",
    sourceUrl: textUrl,
    epubUrl: urls.epubUrl ?? null,
    pdfUrl: urls.pdfUrl ?? null,
    htmlUrl: urls.htmlUrl ?? null,
    pages,
    chapters: chaptersFromText(text, pages)
  };
  if (redis) await redis.set(cacheKey, JSON.stringify(payload), "EX", 60 * 60 * 24);
  return payload;
}

function previewPagesForBook(book, { isFullTextAvailable = false } = {}) {
  return [
    [
      [
        book.description,
        isFullTextAvailable
          ? "A complete public-domain edition is available after this preview."
          : "This title is protected by publisher and author licensing agreements. Full reading access is currently unavailable through this source."
      ].filter(Boolean).join("\n\n")
    ]
  ];
}

export async function getGoogleBookReadingPayload(id, { mode = "preview" } = {}) {
  const book = await getGoogleBook(id);
  if (!book) return null;
  let fullText = null;
  const canonicalSource = canonicalPublicDomainSource(book);
  const isFullRequest = mode === "full";
  if (isFullRequest) {
    try {
      fullText = await getPublicDomainFullText(book);
    } catch {
      fullText = null;
    }
  }
  const isFullTextAvailable = Boolean(fullText || canonicalSource);
  const fullMode = isFullRequest && Boolean(fullText);
  const pages = fullMode && fullText ? fullText.pages : previewPagesForBook(book, { isFullTextAvailable });
  const chapters = fullMode && fullText ? fullText.chapters : [{ title: "Preview Metadata", page: 0 }];
  const licensingMessage = "This title is protected by publisher and author licensing agreements. Full reading access is currently unavailable through this source.";

  return {
    book,
    readerMode: fullMode ? "full" : "preview",
    isFullTextAvailable,
    pages,
    chapters,
    fullTextUrl: isFullTextAvailable ? fullText?.sourceUrl ?? canonicalSource?.textUrl ?? null : null,
    epubUrl: isFullTextAvailable ? fullText?.epubUrl ?? canonicalSource?.epubUrl ?? null : null,
    pdfUrl: isFullTextAvailable ? fullText?.pdfUrl ?? canonicalSource?.pdfUrl ?? null : null,
    htmlUrl: isFullTextAvailable ? fullText?.htmlUrl ?? canonicalSource?.htmlUrl ?? null : null,
    borrowUrl: null,
    source: fullText?.source ?? (canonicalSource ? "Project Gutenberg" : "Google Books"),
    message: fullMode && fullText
      ? `Full public-domain text loaded from ${fullText.source}.`
      : isFullTextAvailable
        ? "Preview loaded. Full public-domain reading is available for this title."
        : licensingMessage
  };
}

export async function getGoogleBook(id) {
  const cacheKey = `book:${id}`;
  const redis = getRedis();
  const cached = redis ? await redis.get(cacheKey) : null;
  if (cached) return JSON.parse(cached);

  const params = new URLSearchParams();
  if (env.googleBooksApiKey) params.set("key", env.googleBooksApiKey);
  const suffix = params.toString() ? `?${params}` : "";
  const data = await requestGoogleBooks(`${GOOGLE_BOOKS_URL}/${encodeURIComponent(id)}${suffix}`);
  const book = data?.id ? normalizeBook(data) : null;

  if (book && redis) await redis.set(cacheKey, JSON.stringify(book), "EX", 60 * 60);
  return book;
}
