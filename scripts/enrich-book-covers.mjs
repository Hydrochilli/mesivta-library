// Resolves and stores a cover_url for every book in the catalog: tries the
// exact ISBN first, then falls back to Open Library's Search API for a cover
// from a different edition of the same title/author (common for popular
// books where the specific ISBN edition was never given a cover).
//
// Usage: node scripts/enrich-book-covers.mjs
// Requires SUPABASE_URL and SUPABASE_KEY (service role) in the environment.
//
// Runs sequentially with a short delay between requests to stay well within
// Open Library's rate limits (https://openlibrary.org/developers/api) — this
// is a one-off/occasional maintenance job, not continuous production traffic.

import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_KEY (service role) in the environment.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocket },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ISBN_RE = /^(97[89]\d{10}|\d{9}[\dXx])$/;
const isLikelyIsbn = (v) => !!v && ISBN_RE.test(v.replace(/[-\s]/g, ""));

// Mirrors src/lib/openLibrary.ts's logic — duplicated here so this script runs
// standalone under plain `node` without a TypeScript loader.
async function coverForExactIsbn(isbn) {
  if (!isLikelyIsbn(isbn)) return null;
  const clean = isbn.replace(/[-\s]/g, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`https://openlibrary.org/isbn/${encodeURIComponent(clean)}.json`, {
      headers: { "User-Agent": "MesivtaLibrary/1.0 (school library site)" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.covers) || data.covers.length === 0) return null;
    return `https://covers.openlibrary.org/b/isbn/${clean}-M.jpg`;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function coverBySearch(title, author) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const params = new URLSearchParams({ title, fields: "cover_i,title", limit: "5" });
    if (author) params.set("author", author);
    const res = await fetch(`https://openlibrary.org/search.json?${params}`, {
      headers: { "User-Agent": "MesivtaLibrary/1.0 (school library site)" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const match = (data.docs ?? []).find((d) => d.cover_i);
    return match ? `https://covers.openlibrary.org/b/id/${match.cover_i}-M.jpg` : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const { data: books, error } = await supabase
  .from("books")
  .select("id, isbn, title, author, cover_url");
if (error) throw error;

let viaIsbn = 0;
let viaFallback = 0;
let none = 0;
let skipped = 0;

for (const book of books) {
  if (book.cover_url) {
    skipped++;
    continue;
  }

  let coverUrl = await coverForExactIsbn(book.isbn);
  if (coverUrl) {
    viaIsbn++;
  } else {
    await sleep(400);
    coverUrl = await coverBySearch(book.title, book.author);
    if (coverUrl) viaFallback++;
    else none++;
  }
  await sleep(400);

  if (coverUrl) {
    const { error: updateError } = await supabase
      .from("books")
      .update({ cover_url: coverUrl })
      .eq("id", book.id);
    if (updateError) console.error(`Failed to save cover for "${book.title}":`, updateError.message);
  }

  console.log(`${coverUrl ? "✓" : "✗"} ${book.title}`);
}

console.log(
  `\nDone. ${viaIsbn} via exact ISBN, ${viaFallback} via title/author fallback, ${none} with no cover found, ${skipped} already had one.`,
);
