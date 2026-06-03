import { BookCarousel } from "@/components/book-carousel";
import { SiteHeader } from "@/components/site-header";
import { getTrendingBooks } from "@/lib/books";

export const metadata = { title: "Trending Books" };

export default async function TrendingPage() {
  const books = await getTrendingBooks();

  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <BookCarousel eyebrow="The books readers cannot stop opening." title="Trending Books" books={books} />
      </main>
    </>
  );
}
