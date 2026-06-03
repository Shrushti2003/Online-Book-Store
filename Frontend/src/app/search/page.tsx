import { SiteHeader } from "@/components/site-header";
import { searchBooks } from "@/lib/books";
import { SearchResults } from "@/components/search-results";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; query?: string }> }) {
  const params = await searchParams;
  const query = params.q ?? params.query ?? "fiction";
  const books = await searchBooks(query);

  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <h1 className="text-5xl font-black">Search the living shelves.</h1>
        <SearchResults initialBooks={books} initialQuery={query} />
      </main>
    </>
  );
}
