import Link from "next/link";
import { ArrowLeft, BookOpen, Trophy } from "lucide-react";

export const metadata = {
  title: "Book Reviews — Mesivta Library",
};

export default function BookReviewsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-panel px-6">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="h-4 w-px bg-border" />
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="size-4 text-accent" />
          Book Reviews
        </span>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Read. Think. Share.</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Tell us about a book you’ve read</h1>
        <p className="mt-4 text-base leading-7 text-muted">
          A good review helps another reader decide what to pick up next. Write honestly,
          give useful details, and you could be selected for a book-review prize.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Step number="1" title="Choose" text="Pick a book you have finished reading." />
          <Step number="2" title="Write" text="Explain what it is about and what you thought." />
          <Step number="3" title="Submit" text="Send in your review using the school’s agreed process." />
        </div>

        <section className="mt-10 rounded-lg border border-border bg-panel p-6">
          <h2 className="text-xl font-bold text-foreground">What makes a useful review?</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            <li><strong className="text-foreground">Introduce the book:</strong> include its title and author, without giving away the ending.</li>
            <li><strong className="text-foreground">Share your response:</strong> describe what you enjoyed, questioned, or found memorable.</li>
            <li><strong className="text-foreground">Use examples:</strong> explain your opinions with specific moments, characters, ideas, or writing choices.</li>
            <li><strong className="text-foreground">Recommend thoughtfully:</strong> say who might enjoy the book and why.</li>
            <li><strong className="text-foreground">Write in your own words:</strong> reviews should be your own work and should not copy publisher or online summaries.</li>
          </ul>
        </section>

        <section className="mt-6 flex gap-4 rounded-lg border border-accent/30 bg-accent-soft p-6">
          <Trophy className="mt-0.5 size-6 shrink-0 text-accent" />
          <div>
            <h2 className="font-bold text-foreground">Prizes</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Selected reviews may be recognised for prizes. The library team will share
              closing dates, prize details, and how to submit reviews as the scheme develops.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-4">
      <span className="flex size-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-fg">
        {number}
      </span>
      <h2 className="mt-3 font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm leading-5 text-muted">{text}</p>
    </div>
  );
}
