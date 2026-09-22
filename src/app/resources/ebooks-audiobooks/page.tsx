import { ExternalLink, ShieldCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { SectionHeader, SectionBody } from "@/components/resources/SectionPage";
import { getSectionContent } from "@/lib/resourceSections";

export const metadata = {
  title: "Ebooks & Audiobooks — Mesivta Library",
};

interface FreeBookResource {
  name: string;
  url: string;
  description: string;
}

const FREE_BOOK_RESOURCES: FreeBookResource[] = [
  {
    name: "Project Gutenberg",
    url: "https://www.gutenberg.org",
    description: "Huge collection of classic/public-domain ebooks.",
  },
  {
    name: "Standard Ebooks",
    url: "https://standardebooks.org",
    description: "Beautifully formatted editions of classic books.",
  },
  {
    name: "LibriVox",
    url: "https://librivox.org",
    description: "Free public-domain audiobooks, read by volunteers.",
  },
  {
    name: "Open Library",
    url: "https://openlibrary.org",
    description: "Book discovery, plus some titles available to read/borrow online.",
  },
  {
    name: "OpenStax",
    url: "https://openstax.org",
    description: "Free textbooks, particularly useful for science, maths, computing and sixth form.",
  },
];

export default async function EbooksAudiobooksPage() {
  const content = await getSectionContent("ebooks-audiobooks");

  return (
    <div className="flex min-h-screen flex-col">
      <SectionHeader label="Ebooks & Audiobooks" />
      <SectionBody
        label="Ebooks & Audiobooks"
        description="Read online for free, plus our own curated UK-checked titles."
        content={content}
      >
        <div className="mt-6 flex flex-col gap-3">
          {FREE_BOOK_RESOURCES.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start justify-between gap-3 rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50"
            >
              <div>
                <p className="font-semibold text-foreground">{r.name}</p>
                <p className="mt-1 text-sm text-muted">{r.description}</p>
              </div>
              <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-2 group-hover:text-accent" />
            </a>
          ))}
        </div>

        <div className="mt-6 flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" />
          <p className="text-sm text-foreground">
            <strong>Copyright note:</strong> Project Gutenberg and Standard Ebooks assess public-domain
            status under <strong>United States</strong> copyright law, not UK law — both state this
            explicitly on their own sites. A title can be public domain in the US while still under
            copyright in the UK. For that reason, we link pupils directly to these services rather
            than copying or re-hosting their books ourselves, unless UK copyright status has been
            separately checked for a specific title.
          </p>
        </div>

        <Link
          href="/digital-library"
          className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-panel p-4 transition hover:border-accent/50"
        >
          <ShieldCheck className="size-5 shrink-0 text-accent" />
          <div>
            <p className="font-semibold text-foreground">School Digital Library</p>
            <p className="text-sm text-muted">
              Browse every UK copyright-checked title we host, across all sections.
            </p>
          </div>
        </Link>
      </SectionBody>
    </div>
  );
}
