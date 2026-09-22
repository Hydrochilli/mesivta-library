"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

export interface FeaturedBook {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  cover_url: string;
}

export function BookCarousel({ books }: { books: FeaturedBook[] }) {
  const [index, setIndex] = useState(0);

  if (books.length === 0) return null;

  const visibleBooks = books.length <= 3
    ? books
    : Array.from({ length: 3 }, (_, offset) => books[(index + offset) % books.length]);
  const canMove = books.length > 3;
  const move = (direction: number) => {
    setIndex((current) => (current + direction + books.length) % books.length);
  };

  return (
    <section aria-labelledby="featured-books-title" className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            From the shelves
          </p>
          <h2 id="featured-books-title" className="mt-1 text-2xl font-bold text-foreground">
            Books of interest
          </h2>
          <p className="mt-1 text-sm text-muted">
            A changing selection from our catalogue.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canMove}
            aria-label="Previous book"
            className="rounded-md border border-border bg-panel p-2 text-muted transition hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!canMove}
            aria-label="Next book"
            className="rounded-md border border-border bg-panel p-2 text-muted transition hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-live="polite">
        {visibleBooks.map((book) => (
          <article key={book.id} className="flex min-h-36 items-center gap-4 rounded-lg border border-border bg-panel p-4 shadow-sm">
            <Image
              src={book.cover_url}
              alt={`Cover of ${book.title}`}
              width={72}
              height={108}
              style={{ width: "72px", height: "108px" }}
              className="shrink-0 rounded object-cover"
            />
            <div className="min-w-0">
              <h3 className="line-clamp-3 font-semibold text-foreground">{book.title}</h3>
              {book.author && <p className="mt-1 line-clamp-2 text-sm text-muted">{book.author}</p>}
              {book.category && <p className="mt-2 line-clamp-2 text-xs text-muted-2">{book.category}</p>}
              <a href={`/catalog?q=${encodeURIComponent(book.title)}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                <Search className="size-3" />
                View in catalogue
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
