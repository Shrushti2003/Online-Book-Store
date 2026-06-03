import Link from "next/link";
import { Library } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SearchResults } from "@/components/search-results";
import { Button } from "@/components/ui/button";
import { getTrendingBooks } from "@/lib/books";
import { genres } from "@/lib/content";

export const metadata = { title: "Library" };

export default async function LibraryPage() {
  const books = await getTrendingBooks();

  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <Library className="mb-5 text-[#7B61FF]" size={34} />
        <h1 className="max-w-4xl text-5xl font-black">All available books, ready to filter.</h1>
        <div className="mt-8 flex gap-3 overflow-x-auto pb-3">
          {genres.slice(0, 18).map((genre) => (
            <Button key={genre.slug} asChild variant="glass">
              <Link href={`/genres/${genre.slug}`}>{genre.name}</Link>
            </Button>
          ))}
        </div>
        <SearchResults initialBooks={books} />
      </main>
    </>
  );
}
