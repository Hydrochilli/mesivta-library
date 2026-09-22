import { SectionHeader, SectionBody } from "@/components/resources/SectionPage";
import { getSectionContent } from "@/lib/resourceSections";

export const metadata = {
  title: "Puzzles & Games — Mesivta Library",
};

export default async function PuzzlesGamesPage() {
  const content = await getSectionContent("puzzles-games");
  return (
    <div className="flex min-h-screen flex-col">
      <SectionHeader label="Puzzles & Games" />
      <SectionBody
        label="Puzzles & Games"
        description="Brain teasers and educational games."
        content={content}
      />
    </div>
  );
}
