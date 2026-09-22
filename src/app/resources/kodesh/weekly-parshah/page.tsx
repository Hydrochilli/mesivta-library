import Link from "next/link";
import { ArrowLeft, BookOpen, FileText, ScrollText } from "lucide-react";

export const metadata = {
  title: "Rabbi Osher Baddiel's Weekly Sidra and Haftorah Sheets — Mesivta Library",
};

const SERIES = [
  {
    title: "Questions for the Sidra",
    description: "Thought-provoking questions for personal study, chavrusa discussion, or a class conversation.",
    icon: <FileText className="size-5 text-accent" />,
    href: "/resources/kodesh/weekly-parshah/questions",
  },
  {
    title: "Sidra of the Week",
    description: "Explanatory notes and background to help make the weekly Parshah richer and more accessible.",
    icon: <BookOpen className="size-5 text-accent" />,
    href: "/resources/kodesh/weekly-parshah/sidra",
  },
  {
    title: "Haftarah Notes",
    description: "Context, themes, and connections between the Haftarah and the weekly Sidra.",
    icon: <ScrollText className="size-5 text-accent" />,
    href: "/resources/kodesh/weekly-parshah/haftorah",
  },
  {
    title: "Thematic Essays",
    description: "Longer pieces exploring ideas such as Shabbos, faith, Jewish history, and Torah values.",
    icon: <BookOpen className="size-5 text-accent" />,
    href: "/resources/kodesh/weekly-parshah/essays",
  },
];

const UPLOADED_SHEETS = [
  {
    title: "Bemidbor — Questions for the Sidra",
    description: "Questions for discussion and personal study on Sidra Bemidbor.",
    href: "/kodesh/bemidbor-questions.pdf",
  },
  {
    title: "Bemidbor — Sidra of the Week",
    description: "Explanatory notes, diagrams, and learning material for the Sidra.",
    href: "/kodesh/bemidbor-sidra-notes.pdf",
  },
  {
    title: "Bemidbor — Haftarah",
    description: "Haftarah notes and the connection between the Haftarah and the Sidra.",
    href: "/kodesh/bemidbor-haftorah.pdf",
  },
];

export default function WeeklyParshahPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-panel px-6">
        <Link href="/resources/kodesh" className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Kodesh
        </Link>
        <div className="h-4 w-px bg-border" />
        <span className="text-sm font-semibold text-foreground">Weekly Parshah</span>
      </header>

      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Kodesh reading archive</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Rabbi Osher Baddiel&apos;s Weekly Sidra and Haftorah Sheets</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          A growing collection of written Torah learning sheets from one author. The original PDFs
          will remain available as the authoritative version, with a clean reading page and download
          option for each issue.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SERIES.map((item) => (
            <Link key={item.title} href={item.href ?? "#"} className={`block rounded-lg border border-border bg-panel p-5 transition hover:border-accent/50 ${item.href ? "" : "cursor-default opacity-80"}`}>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-accent-soft p-2">{item.icon}</div>
                <h2 className="font-semibold text-foreground">{item.title}</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
              <p className="mt-4 text-xs text-muted-2">Issues will appear here as they are reviewed and uploaded.</p>
            </Link>
          ))}
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-foreground">Available sheets</h2>
          <p className="mt-1 text-sm text-muted">
            The original PDFs are preserved for reading online or downloading.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {UPLOADED_SHEETS.map((sheet) => (
              <article key={sheet.href} className="flex flex-col gap-3 rounded-lg border border-border bg-panel p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{sheet.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{sheet.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a href={sheet.href} target="_blank" rel="noreferrer" className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent">
                    Read PDF
                  </a>
                  <a href={sheet.href} download className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:opacity-90">
                    Download
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-accent/30 bg-accent-soft p-5">
          <h2 className="font-semibold text-foreground">How each issue will be presented</h2>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-muted">
            <li>1. A short catalogue entry with the Parshah, document type, author, and a brief description.</li>
            <li>2. A browser-friendly PDF reading view that preserves the original page design, Hebrew, diagrams, and pagination.</li>
            <li>3. A clear download button for students who want to keep or print the sheet.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
