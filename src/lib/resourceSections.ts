// Shared config + data fetching for the Educational Resources sections.
// Each section can contain a mix of third-party links (the `resources` table)
// and individually reviewed, on-site hosted files (`digital_library_titles`,
// published only) — matched by the `category` column on each.

import { createAdminClient } from "@/lib/supabase/server";

export interface ResourceSection {
  slug: string;
  label: string;
  description: string;
  image: string;
  /** Shown as a small caption on the card — required for CC BY/CC BY-SA photo credit,
   *  or used for a name/role caption on our own staff photos (e.g. Kodesh). */
  credit?: string;
}

export const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    slug: "ebooks-audiobooks",
    label: "Ebooks & Audiobooks",
    description: "Read online for free, plus our own curated UK-checked titles",
    image: "/resources/ebooks-audiobooks-v2.jpg",
    credit: "Photo: Martouf (Wikimedia Commons, public domain)",
  },
  {
    slug: "kodesh",
    label: "Kodesh",
    description: "Torah study resources and materials",
    image: "/resources/kodesh-v2.jpg",
    credit: "Rabbi D Benarroch, Menahel",
  },
  {
    slug: "stem",
    label: "STEM",
    description: "Science, technology, engineering & maths",
    image: "/resources/stem.jpg",
  },
  {
    slug: "arts-humanities",
    label: "Arts & Humanities",
    description: "Literature, history, languages and the arts",
    image: "/resources/arts-humanities.jpg",
    credit: "Photo: Shixart1985 (Wikimedia Commons, CC BY 2.0)",
  },
  {
    slug: "puzzles-games",
    label: "Puzzles & Games",
    description: "Brain teasers and educational games",
    image: "/resources/puzzles-games.jpg",
    credit: "Photo: Balise42 (Wikimedia Commons, CC BY-SA 4.0)",
  },
];

export async function getSectionContent(category: string) {
  const supabase = createAdminClient();

  const [{ data: links, error: linksError }, { data: titles, error: titlesError }] = await Promise.all([
    supabase
      .from("resources")
      .select("id, title, description, url")
      .eq("category", category)
      .order("title"),
    supabase
      .from("digital_library_titles")
      .select("id, title, author, format, file_path")
      .eq("category", category)
      .eq("published", true)
      .order("title"),
  ]);
  if (linksError) throw linksError;
  if (titlesError) throw titlesError;

  const hostedTitles = await Promise.all(
    (titles ?? []).map(async (item) => {
      const { data: signed } = await supabase.storage
        .from("digital-library")
        .createSignedUrl(item.file_path, 60 * 60);
      return { ...item, downloadUrl: signed?.signedUrl ?? null };
    }),
  );

  return { links: links ?? [], hostedTitles };
}
