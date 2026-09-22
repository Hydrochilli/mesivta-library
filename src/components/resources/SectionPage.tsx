import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, ShieldCheck } from "lucide-react";
import type { getSectionContent } from "@/lib/resourceSections";

interface SectionPageProps {
  label: string;
  description: string;
  content: Awaited<ReturnType<typeof getSectionContent>>;
  /** Extra content rendered above the links/titles lists (e.g. the ebooks-audiobooks curated list). */
  children?: React.ReactNode;
}

export function SectionHeader({ label }: { label: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-panel px-6">
      <Link href="/resources" className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="h-4 w-px bg-border" />
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </header>
  );
}

export function SectionBody({ label, description, content, children }: SectionPageProps) {
  const { links, hostedTitles } = content;
  const isEmpty = links.length === 0 && hostedTitles.length === 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground">{label}</h1>
      <p className="mt-2 text-sm text-muted">{description}</p>

      {children}

      {hostedTitles.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {hostedTitles.map((t) => (
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
      )}

      {links.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {links.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start justify-between gap-3 rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50"
            >
              <div>
                <p className="font-semibold text-foreground">{r.title}</p>
                {r.description && <p className="mt-1 text-sm text-muted">{r.description}</p>}
              </div>
              <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-2 group-hover:text-accent" />
            </a>
          ))}
        </div>
      )}

      {isEmpty && !children && (
        <p className="mt-6 text-sm text-muted">No resources have been added to this section yet.</p>
      )}
    </div>
  );
}
