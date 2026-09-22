import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";

// No public OPAC/API is available from the library's system (easylib/Abracadabra),
// so search runs natively against our own `books` table, kept up to date via
// scripts/import-books-csv.mjs. NEXT_PUBLIC_ABRACADABRA_OPAC_URL is kept as an
// optional override in case a public, embeddable catalog link becomes available later.
const OPAC_URL = process.env.NEXT_PUBLIC_ABRACADABRA_OPAC_URL;

export const metadata = {
  title: "Catalog Search — Mesivta Library",
};

async function searchBooks(query: string) {
  if (!query) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("books")
    .select("id, isbn, title, author, category, available, cover_url")
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    .order("title")
    .limit(40);
  if (error) throw error;
  return data ?? [];
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  if (OPAC_URL) {
    return (
      <div className="flex min-h-screen flex-col">
        <CatalogHeader />
        <iframe src={OPAC_URL} title="Library catalog search" className="flex-1 border-0" />
      </div>
    );
  }

  let results: Awaited<ReturnType<typeof searchBooks>> = [];
  let searchError: string | null = null;
  try {
    results = await searchBooks(q.trim());
  } catch (e) {
    searchError = (e as Error).message;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <CatalogHeader />

      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <form className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by title or author…"
            className="flex-1 rounded-md border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
          >
            <Search className="size-4" />
            Search
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3">
          {searchError && (
            <p className="text-sm text-danger">Search failed: {searchError}</p>
          )}
          {!searchError && q && results.length === 0 && (
            <p className="text-sm text-muted">No books matched &quot;{q}&quot;.</p>
          )}
          {!q && !searchError && (
            <p className="text-sm text-muted">Enter a title or author to search the catalog.</p>
          )}
          {results.map((book) => (
            <div
              key={book.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-panel p-4"
            >
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={`Cover of ${book.title}`}
                  width={48}
                  height={72}
                  style={{ width: "48px", height: "72px" }}
                  className="shrink-0 rounded object-cover"
                />
              ) : (
                <BookOpen className="mt-0.5 size-5 shrink-0 text-accent" />
              )}
              <div>
                <p className="font-semibold text-foreground">{book.title}</p>
                {book.author && <p className="text-sm text-muted">{book.author}</p>}
                <p className="mt-1 text-xs text-muted-2">
                  {book.category ?? "Uncategorised"} ·{" "}
                  {book.available ? "Available" : "On loan"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CatalogHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-panel px-6">
      <Link href="/" className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="h-4 w-px bg-border" />
      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Search className="size-4 text-accent" />
        Catalog Search
      </span>
    </header>
  );
}
