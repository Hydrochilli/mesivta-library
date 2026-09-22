// Imports a book catalog CSV export (from the easylib/Abracadabra admin panel)
// into the `books` table. Re-running with a fresh export upserts by isbn.
//
// Usage: node scripts/import-books-csv.mjs path/to/export.csv
//
// Expected columns (case-insensitive, any order): isbn, title, author,
// category, available, cover_url. Only "title" is required per row.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const [, , csvPath] = process.argv;
if (!csvPath) {
  console.error("Usage: node scripts/import-books-csv.mjs path/to/export.csv");
  process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_KEY (service role) in the environment.");
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const text = readFileSync(csvPath, "utf8");
const rows = parseCsv(text);
const header = rows[0].map((h) => h.trim().toLowerCase());
const idx = (name) => header.indexOf(name);

const books = rows.slice(1).map((cols) => ({
  isbn: idx("isbn") >= 0 ? cols[idx("isbn")]?.trim() || null : null,
  title: cols[idx("title")]?.trim(),
  author: idx("author") >= 0 ? cols[idx("author")]?.trim() || null : null,
  category: idx("category") >= 0 ? cols[idx("category")]?.trim() || null : null,
  available: idx("available") >= 0
    ? !["0", "false", "no"].includes((cols[idx("available")] || "").trim().toLowerCase())
    : true,
  cover_url: idx("cover_url") >= 0 ? cols[idx("cover_url")]?.trim() || null : null,
  updated_at: new Date().toISOString(),
})).filter((b) => b.title);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  // Node 20/21 have no native WebSocket — pass ws for realtime init to succeed.
  realtime: { transport: WebSocket },
});

const withIsbn = books.filter((b) => b.isbn);
const withoutIsbn = books.filter((b) => !b.isbn);

if (withIsbn.length) {
  const { error } = await supabase.from("books").upsert(withIsbn, { onConflict: "isbn" });
  if (error) throw error;
}
if (withoutIsbn.length) {
  const { error } = await supabase.from("books").insert(withoutIsbn);
  if (error) throw error;
}

console.log(`Imported ${books.length} books (${withIsbn.length} upserted by isbn, ${withoutIsbn.length} inserted).`);
