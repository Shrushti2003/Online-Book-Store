import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getBook } from "@/lib/books";
import { BookActions } from "@/components/book-actions";
import { BookCoverArt } from "@/components/book-cover-art";

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  return (
    <>
      <SiteHeader />
      <main className="page-shell grid gap-10 pt-28 pb-20 lg:grid-cols-[360px_1fr]">
        <div className="book-spine min-h-[500px] overflow-hidden rounded-[8px] p-8 text-white shadow-2xl" style={{ background: book.cover }}>
          {book.thumbnail || book.coverCandidates?.length ? (
            <div className="relative mx-auto aspect-[3/4] h-full max-h-[520px] overflow-hidden rounded-[8px] shadow-2xl">
              <BookCoverArt book={book} priority />
            </div>
          ) : (
            <>
              <p className="text-sm font-bold opacity-80">{book.genre}</p>
              <h1 className="mt-56 text-5xl font-black">{book.title}</h1>
            </>
          )}
        </div>
        <section>
          <p className="font-bold text-[#FF4ECD]">{book.author}</p>
          <h2 className="mt-3 text-6xl font-black">{book.title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#1E1E1E]/70">{book.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="glow">
              <Link href={`/reader?book=${encodeURIComponent(book.id)}`}>
                <Sparkles size={18} /> Start Reading
              </Link>
            </Button>
            <BookActions book={book} />
            <Button variant="glass">
              <MessageCircle size={18} /> Talk With Characters
            </Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["AI summary ready", "14 highlighted quotes", "Readers call it cinematic"].map((item) => (
              <div key={item} className="rounded-[8px] border border-black/10 bg-white/56 p-4 font-bold">
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
