import { SectionHeader, SectionBody } from "@/components/resources/SectionPage";
import { getSectionContent } from "@/lib/resourceSections";

export const metadata = {
  title: "STEM — Mesivta Library",
};

export default async function StemPage() {
  const content = await getSectionContent("stem");
  return (
    <div className="flex min-h-screen flex-col">
      <SectionHeader label="STEM" />
      <SectionBody
        label="STEM"
        description="Science, technology, engineering & maths resources."
        content={content}
      />
    </div>
  );
}
