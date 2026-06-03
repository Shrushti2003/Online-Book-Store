import { notFound } from "next/navigation";
import { BookCard } from "@/components/book-card";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { genres } from "@/lib/content";
import { getCategoryBooks } from "@/lib/books";

export function generateStaticParams() {
  return genres.map((genre) => ({ slug: genre.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const genre = genres.find((item) => item.slug === slug);
  return { title: genre ? genre.name : "Genre" };
}

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const genre = genres.find((item) => item.slug === slug);
  if (!genre) notFound();
  const books = await getCategoryBooks(genre.name);

  return (
    <>
      <SiteHeader />
      <main className="pt-24 pb-20">
        <section
          className="min-h-[58vh] border-b border-black/10 px-4 py-20"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${genre.accent}55, transparent 26rem), linear-gradient(135deg, #FFF7ED, #fff)`
          }}
        >
          <div className="page-shell">
            <p className="mb-4 font-bold" style={{ color: genre.accent }}>
              {genre.tone}
            </p>
            <h1 className="max-w-4xl text-6xl font-black leading-[0.96]">{genre.headline}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#1E1E1E]/70">{genre.copy}</p>
          </div>
        </section>
        <section className="page-shell mt-10 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <Card className="p-6">
            <p className="font-bold" style={{ color: genre.accent }}>
              Visual Direction
            </p>
            <h2 className="mt-3 text-3xl font-black">{genre.atmosphere}</h2>
            <p className="mt-4 text-[#1E1E1E]/68">Animation style: {genre.motion}.</p>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            {books.slice(0, 4).map((book, index) => (
              <BookCard key={book.id} book={{ ...book, genre: genre.name }} index={index} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
