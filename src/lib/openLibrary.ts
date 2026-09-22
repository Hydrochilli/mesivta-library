// Open Library public API (no key required): https://openlibrary.org/developers/api
// Used to enrich book records (covers, publish date, subjects) wherever an ISBN
// is available — the catalog page today, learning resources later.
//
// Uses the ISBN API + Covers API (both actively maintained). The older
// /api/books legacy endpoint documented alongside these returns 404 as of
// writing — avoid it.

export interface OpenLibraryBook {
  title?: string;
  cover?: { small?: string; medium?: string; large?: string };
  publish_date?: string;
  number_of_pages?: number;
  subjects?: string[];
}

const ISBN_RE = /^(97[89]\d{10}|\d{9}[\dXx])$/;

export function isLikelyIsbn(value: string | null | undefined): value is string {
  if (!value) return false;
  return ISBN_RE.test(value.replace(/[-\s]/g, ""));
}

/** Fetches enrichment data for one ISBN. Returns null if there's no match, no ISBN, or it's slow. */
export async function fetchOpenLibraryBook(isbn: string): Promise<OpenLibraryBook | null> {
  if (!isLikelyIsbn(isbn)) return null;
  const clean = isbn.replace(/[-\s]/g, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`https://openlibrary.org/isbn/${encodeURIComponent(clean)}.json`, {
      headers: { "User-Agent": "MesivtaLibrary/1.0 (school library site)" },
      next: { revalidate: 60 * 60 * 24 * 7 }, // book metadata rarely changes — cache a week
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Only build cover URLs when Open Library actually has cover art for this
    // edition (data.covers) — otherwise the URL formula still "works" but
    // points at nothing, which just renders as broken/placeholder images.
    const hasCover = Array.isArray(data.covers) && data.covers.length > 0;
    return {
      title: data.title,
      publish_date: data.publish_date,
      number_of_pages: data.number_of_pages,
      subjects: data.subjects,
      cover: hasCover
        ? {
            small: `https://covers.openlibrary.org/b/isbn/${clean}-S.jpg`,
            medium: `https://covers.openlibrary.org/b/isbn/${clean}-M.jpg`,
            large: `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`,
          }
        : undefined,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Falls back to Open Library's Search API to find a cover from a different
 * edition of the same title/author, when the exact ISBN has none. Used by
 * scripts/enrich-book-covers.mjs — a specific edition often lacks a cover
 * even for well-known books, since covers are attached per-edition.
 */
export async function searchOpenLibraryCover(
  title: string,
  author?: string | null,
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const params = new URLSearchParams({
      title,
      fields: "cover_i,title",
      limit: "5",
    });
    if (author) params.set("author", author);
    const res = await fetch(`https://openlibrary.org/search.json?${params}`, {
      headers: { "User-Agent": "MesivtaLibrary/1.0 (school library site)" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const match = (data.docs ?? []).find((d: { cover_i?: number }) => d.cover_i);
    if (!match) return null;
    return `https://covers.openlibrary.org/b/id/${match.cover_i}-M.jpg`;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
