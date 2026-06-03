"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { KeyboardEvent, useRef } from "react";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book";

export function BookCarousel({ title, eyebrow, books }: { title: string; eyebrow?: string; books: Book[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    scroller.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") scroll(-1);
    if (event.key === "ArrowRight") scroll(1);
  }

  return (
    <section className="relative">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {eyebrow ? <p className="font-bold text-[#FF4ECD]">{eyebrow}</p> : null}
          <h2 className="text-3xl font-black md:text-4xl">{title}</h2>
        </div>
        <div className="flex gap-2">
          <Button aria-label={`Previous ${title}`} onClick={() => scroll(-1)} size="icon" type="button" variant="glass">
            <ChevronLeft size={18} />
          </Button>
          <Button aria-label={`Next ${title}`} onClick={() => scroll(1)} size="icon" type="button" variant="glass">
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      <div
        className="-mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-4 [scrollbar-width:thin]"
        onKeyDown={handleKeyDown}
        ref={scroller}
        role="list"
        tabIndex={0}
      >
        {books.map((book, index) => (
          <div className="w-[280px] shrink-0 snap-start sm:w-[300px]" key={`${book.id}-${index}`} role="listitem">
            <BookCard book={book} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
