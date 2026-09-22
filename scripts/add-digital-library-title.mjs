// Uploads a single ebook file to Supabase Storage and records it in
// digital_library_titles. New entries are always created with published=false —
// you must explicitly flip that in the database (or a future admin UI) after
// reviewing the copyright justification. This script never auto-publishes.
//
// Usage:
//   node scripts/add-digital-library-title.mjs \
//     --file ./path/to/book.epub \
//     --title "Book Title" \
//     --author "Author Name" \
//     --category kodesh \
//     --basis "Author died 1920 — public domain in UK (life+70)" \
//     --reviewer "Mr S Mainzer"
//
// --category should be one of: ebooks-audiobooks, kodesh, stem, arts-humanities,
// puzzles-games (see src/lib/resourceSections.ts). Defaults to "general" if omitted,
// which only shows up on /digital-library, not any specific section page.
//
// Requires SUPABASE_URL and SUPABASE_KEY (service role) in the environment,
// and a Supabase Storage bucket named "digital-library" to already exist
// (create it once in the Supabase dashboard: Storage → New bucket).

import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    args[key] = argv[i + 1];
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const { file, title, author, basis, reviewer, category } = args;

if (!file || !title || !basis || !reviewer) {
  console.error(
    "Usage: node scripts/add-digital-library-title.mjs --file <path> --title <title> --author <author> --basis <copyright justification> --reviewer <name>",
  );
  process.exit(1);
}

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

const fileBuffer = readFileSync(file);
const ext = extname(file).replace(".", "").toLowerCase();
const storagePath = `${Date.now()}-${basename(file)}`;

const { error: uploadError } = await supabase.storage
  .from("digital-library")
  .upload(storagePath, fileBuffer, { contentType: `application/${ext}` });
if (uploadError) throw uploadError;

const { error: insertError } = await supabase.from("digital_library_titles").insert({
  title,
  author: author ?? null,
  format: ext,
  file_path: storagePath,
  category: category ?? "general",
  copyright_basis: basis,
  reviewed_by: reviewer,
  published: false,
});
if (insertError) throw insertError;

console.log(
  `Uploaded "${title}" as unpublished. Review the copyright_basis in the digital_library_titles table, then set published=true to make it live.`,
);
