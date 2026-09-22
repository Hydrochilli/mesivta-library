import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Download, ShieldCheck } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata = {
  title: "School Digital Library — Mesivta Library",
};

async function getPublishedTitles() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("digital_library_titles")
    .select("id, title, author, format, file_path")
    .eq("published", true)
    .order("title");
  if (error) throw error;

  // Signed URLs so the storage bucket doesn't need to be public.
  return Promise.all(
    (data ?? []).map(async (item) => {
      const { data: signed } = await supabase.storage
        .from("digital-library")
        .createSignedUrl(item.file_path, 60 * 60);
      return { ...item, downloadUrl: signed?.signedUrl ?? null };
    }),
  );
}

export default async function DigitalLibraryPage() {
  let titles: Awaited<ReturnType<typeof getPublishedTitles>> = [];
  let loadError: string | null = null;
  try {
    titles = await getPublishedTitles();
  } catch (e) {
    loadError = (e as Error).message;
  }

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
          School Digital Library
        </span>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-foreground">Individually Curated Titles</h1>
        <p className="mt-2 text-sm text-muted">
          A small collection hosted directly on our own site. Every title here has been
          individually reviewed and its UK copyright status confirmed before publishing —
          unlike the wider &quot;Read Online for Free&quot; links, which point to services that
          assess public-domain status under US law.
        </p>

        {loadError && (
          <p className="mt-6 text-sm text-danger">Could not load the digital library: {loadError}</p>
        )}
        {!loadError && titles.length === 0 && (
          <p className="mt-6 text-sm text-muted">No titles have been published yet.</p>
        )}

        <Link
          href="/resources/kodesh/weekly-parshah"
          className="relative mt-6 block overflow-hidden rounded-lg border border-accent/30 bg-panel-2 p-5 transition hover:border-accent/60"
        >
          <Image
            src="/kodesh/osher-36-faded-v3.png"
            alt=""
            width={231}
            height={308}
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full w-auto max-w-[45%] object-cover object-top"
          />
          <div className="relative max-w-[65%]">
            <div className="flex items-center gap-2">
              <Image src="/shield-only-v3.png" alt="" width={20} height={20} aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Featured collection</p>
            </div>
            <h2 className="mt-2 text-xl font-bold text-foreground">Rabbi Osher Baddiel&apos;s Weekly Sidra and Haftorah Sheets</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Questions, Sidra notes, Haftarah explanations, and longer thematic essays from the
              same written Torah series.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-accent">Browse the archive →</span>
          </div>
        </Link>

        <div className="mt-6 flex flex-col gap-3">
          {titles.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-panel p-4"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-foreground">{t.title}</p>
                  {t.author && <p className="text-sm text-muted">{t.author}</p>}
                  <p className="mt-1 text-xs uppercase text-muted-2">{t.format}</p>
                </div>
              </div>
              {t.downloadUrl && (
                <a
                  href={t.downloadUrl}
                  className="flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:opacity-90"
                >
                  <Download className="size-3.5" />
                  Download
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
