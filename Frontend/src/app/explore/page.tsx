import Link from "next/link";
import { Compass } from "lucide-react";
import { BookCarousel } from "@/components/book-carousel";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getTrendingBooks } from "@/lib/books";
import { genres } from "@/lib/content";

export const metadata = { title: "Explore" };

export default async function ExplorePage() {
  const books = await getTrendingBooks();

  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <section className="mb-14 rounded-[8px] bg-[#1E1E1E] p-8 text-[#FFF7ED] md:p-12">
          <Compass className="mb-6 text-[#3AEFFF]" size={34} />
          <h1 className="max-w-3xl text-5xl font-black">Choose a doorway. Lumi will remember what pulls you in.</h1>
          <p className="mt-5 max-w-2xl text-[#FFF7ED]/70">Explore genre worlds, trending shelves, new releases, previews, social reading rooms, and AI-curated collections.</p>
        </section>
        <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {genres.map((genre) => (
            <Button key={genre.slug} asChild variant="glass" className="justify-start">
              <Link href={`/genres/${genre.slug}`}>{genre.name}</Link>
            </Button>
          ))}
        </div>
        <BookCarousel eyebrow="Recommended Books" title="Browse more without losing your place." books={books} />
      </main>
    </>
  );
}
