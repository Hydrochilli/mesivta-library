import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen } from "lucide-react";
import { RESOURCE_SECTIONS } from "@/lib/resourceSections";

export const metadata = {
  title: "Educational Resources — Mesivta Library",
};

export default function ResourcesPage() {
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
          Educational Resources
        </span>
      </header>

      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold text-foreground">Educational Resources</h1>
        <p className="mt-2 text-sm text-muted">
          Browse by subject area. Each section mixes third-party links and titles we host directly
          ourselves.
        </p>

        <Link
          href="/digital-library"
          className="group mt-6 flex items-center gap-4 rounded-lg border border-border bg-panel p-5 transition hover:border-accent/50"
        >
          <div className="rounded-full bg-accent-soft p-2">
            <Image src="/shield-only-v3.png" alt="" width={28} height={28} aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Mesivta Digital Library</p>
            <p className="mt-1 text-sm text-muted">
              Curated, UK copyright-checked titles hosted for the school community.
            </p>
          </div>
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {RESOURCE_SECTIONS.map((s) => (
            <Link
              key={s.slug}
              href={`/resources/${s.slug}`}
              className="group relative flex h-40 items-end overflow-hidden rounded-lg border border-border transition hover:border-accent/50"
            >
              <Image
                src={s.image}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
              <div className="relative z-10 flex w-full items-end justify-between gap-2 p-4">
                <div>
                  <p className="font-semibold text-white drop-shadow">{s.label}</p>
                  <p className="mt-0.5 text-xs text-white/80 drop-shadow">{s.description}</p>
                </div>
              </div>
              {s.credit && (
                <span className="absolute bottom-1 right-2 z-10 text-[10px] text-white/60">
                  {s.credit}
                </span>
              )}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}


