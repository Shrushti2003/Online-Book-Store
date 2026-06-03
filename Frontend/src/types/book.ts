export type Book = {
  id: string;
  title: string;
  author: string;
  authors?: string[];
  genre: string;
  categories?: string[];
  mood: string;
  rating: number;
  cover: string;
  thumbnail?: string | null;
  coverCandidates?: string[];
  previewLink?: string | null;
  webReaderLink?: string | null;
  viewability?: string;
  embeddable?: boolean;
  publicDomain?: boolean;
  textToSpeechPermission?: string;
  isFullTextAvailable?: boolean;
  fullTextSource?: string;
  readingSource?: {
    provider: string;
    label: string;
    fullTextAvailable?: boolean;
    licensedAccessAvailable?: boolean;
    borrowAvailable?: boolean;
    readUrl?: string | null;
    borrowUrl?: string | null;
    epubUrl?: string | null;
    pdfUrl?: string | null;
    htmlUrl?: string | null;
  };
  language?: string;
  description: string;
  progress?: number;
};

export type GenreWorld = {
  slug: string;
  name: string;
  tone: string;
  headline: string;
  copy: string;
  accent: string;
  atmosphere: string;
  motion: string;
};
