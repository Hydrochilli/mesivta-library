import Image from "next/image";
import { BookOpen, CalendarDays, Megaphone, ScrollText, Search, Code2, Trees, ShieldCheck } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { BookCarousel, type FeaturedBook } from "@/components/home/BookCarousel";

const CODE_CLUB_URL = process.env.NEXT_PUBLIC_CODE_CLUB_URL || "https://code.example.org";

async function getFeaturedBooks(): Promise<FeaturedBook[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("books")
      .select("id, title, author, category, cover_url")
      .not("cover_url", "is", null)
      .order("title")
      .limit(80);
    const selected: FeaturedBook[] = [];
    const authors = new Set<string>();
    const categories = new Set<string>();
    for (const book of data ?? []) {
      if (!book.cover_url) continue;
      const author = book.author?.toLowerCase() ?? "";
      const category = book.category?.toLowerCase() ?? "";
      if (selected.length < 3 || (!authors.has(author) && !categories.has(category))) {
        selected.push(book as FeaturedBook);
        if (author) authors.add(author);
        if (category) categories.add(category);
      }
      if (selected.length === 12) break;
    }
    return selected;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredBooks = await getFeaturedBooks();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-panel">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-5">
          <Image src="/shield-crop.png" alt="Mesivta Library logo" width={52} height={69} />
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold tracking-tight text-foreground">Mesivta Library</span>
            <span className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">Manchester Mesivta</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <section className="relative overflow-hidden rounded-xl border border-border bg-slate-900">
          <Image src="/home/catalog-search.jpg" alt="Library shelves" fill sizes="(min-width: 1024px) 1152px, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="relative z-10 px-6 py-10 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Officially open</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">The library is now open</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">
              Books are now available for loan. Come and explore the shelves, find your next read, and make the most of everything the library has to offer.
            </p>
          </div>
        </section>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Opening hours</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-panel p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Monday – Thursday</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-accent">12:35 – 1:20</p>
              <p className="mt-2 text-sm text-muted">Open to all students</p>
            </div>
            <div className="rounded-xl border border-border bg-panel p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Sixth Form Only</p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-accent">2:20 – 3:20</p>
              <p className="mt-2 text-sm text-muted">Extra afternoon session</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-xl border border-accent/30 bg-accent-soft p-4 shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent text-xl text-accent-fg">📚</div>
          <div>
            <p className="text-lg font-semibold text-foreground">Books are now available for loan</p>
            <p className="text-sm text-muted">See Mr Mainzer in the Library for further information.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <NavCard icon={<Megaphone className="size-6 text-foreground" />} title="Announcements" subtitle="Library news and updates" href="/announcements" />
          <NavCard icon={<CalendarDays className="size-6 text-foreground" />} title="Events" subtitle="What's coming up" href="/events" />
          <NavCard icon={<ScrollText className="size-6 text-foreground" />} title="Rules & Membership" subtitle="How the library works" href="/membership" />
          <NavCard icon={<BookOpen className="size-6 text-foreground" />} title="Educational Resources" subtitle="Reading & research material" href="/resources" />
          <NavCard icon={<ShieldCheck className="size-6 text-foreground" />} title="Kodesh Resources" subtitle="Torah study and weekly Parshah sheets" href="/resources/kodesh" />
          <NavCard icon={<Trees className="size-6 text-foreground" />} title="Outdoor Education" subtitle="Programs and services" href="/outdoor-ed" />
        </div>

        <div className="mt-8">
          <BookCarousel books={featuredBooks} />
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <section className="relative overflow-hidden rounded-xl border border-border">
            <Image src="/home/book-reviews.jpg" alt="A student writing in a book" fill sizes="(min-width: 1024px) 1152px, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-slate-950/70" />
            <div className="relative z-10 max-w-2xl px-6 py-10 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Share what you think</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Write a book review. Win a prize.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">Tell other students what you thought, recommend your next great read, and get the chance to have your review selected for a prize.</p>
              <a href="/book-reviews" className="mt-5 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:opacity-90">Find out how to enter</a>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-xl border border-border">
            <Image
              src="/home/catalog-search.jpg"
              alt="Rows of books in a library"
              fill
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/70" />
            <div className="relative z-10 max-w-2xl px-6 py-10 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Explore the shelves</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Catalog Search</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">
                Search the Mesivta Library catalogue by title or author and find your next book.
              </p>
              <a
                href="/catalog"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:opacity-90"
              >
                <Search className="size-4" />
                Search the catalogue
              </a>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-xl border border-border">
            <Image src="/home/code-club.jpg" alt="Programming code on a computer screen" fill sizes="(min-width: 1024px) 1152px, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-slate-950/75" />
            <div className="relative z-10 max-w-2xl px-6 py-10 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Build what comes next</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Mesivta Code - Coding &amp; AI Club</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">Learn to code, explore AI, and build useful things with the Mesivta Code Club.</p>
              <a href={CODE_CLUB_URL} className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:opacity-90">
                <Code2 className="size-4" />
                Visit Code Club
              </a>
              <p className="mt-3 text-[10px] text-white/60">Image: Martin Vorel, CC BY-SA 4.0, via Wikimedia Commons</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-2">Mesivta Library · Manchester Mesivta</footer>
    </div>
  );
}

function NavCard({ icon, title, subtitle, href, wide = false }: { icon: React.ReactNode; title: string; subtitle: string; href: string; wide?: boolean }) {
  return (
    <a href={href} className={`group flex gap-4 rounded-xl border border-border bg-panel p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md ${wide ? "w-full flex-row items-center" : "flex-col"}`}>
      <div className="w-fit rounded-full bg-accent-soft p-3">{icon}</div>
      <div><span className="block text-lg font-semibold text-foreground">{title}</span><span className="text-sm text-muted">{subtitle}</span></div>
    </a>
  );
}
