import { BookCarousel } from "@/components/book-carousel";
import { SiteHeader } from "@/components/site-header";
import { searchBooks } from "@/lib/books";

export const metadata = { title: "New Releases" };

export default async function NewReleasesPage() {
  const books = await searchBooks("new releases fiction");

  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <BookCarousel eyebrow="Fresh worlds, newly opened." title="New Releases" books={books} />
      </main>
    </>
  );
}
