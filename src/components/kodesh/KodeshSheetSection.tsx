import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";

export interface KodeshSheet {
  title: string;
  description: string;
  href: string;
}

export function KodeshSheetSection({
  title,
  description,
  sheets,
}: {
  title: string;
  description: string;
  sheets: KodeshSheet[];
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-panel px-6">
        <Link href="/resources/kodesh/weekly-parshah" className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to archive
        </Link>
        <div className="h-4 w-px bg-border" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Rabbi Osher Baddiel&apos;s collection</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p>

        <div className="mt-8 flex flex-col gap-4">
          {sheets.map((sheet) => (
            <article key={sheet.href} className="rounded-lg border border-border bg-panel p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-accent-soft p-2">
                  <FileText className="size-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-foreground">{sheet.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted">{sheet.description}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 pl-11">
                <a href={sheet.href} target="_blank" rel="noreferrer" className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent">
                  Read PDF
                </a>
                <a href={sheet.href} download className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:opacity-90">
                  <Download className="size-3.5" />
                  Download
                </a>
              </div>
            </article>
          ))}
          {sheets.length === 0 && <p className="text-sm text-muted">No sheets have been added here yet.</p>}
        </div>
      </main>
    </div>
  );
}
