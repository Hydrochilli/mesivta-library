import { SectionHeader, SectionBody } from "@/components/resources/SectionPage";
import { getSectionContent } from "@/lib/resourceSections";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Kodesh — Mesivta Library",
};

export default async function KodeshPage() {
  const content = await getSectionContent("kodesh");
  return (
    <div className="flex min-h-screen flex-col">
      <SectionHeader label="Kodesh" />
      <SectionBody
        label="Kodesh"
        description="Torah study resources and materials."
        content={content}
      >
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
      </SectionBody>
    </div>
  );
}
