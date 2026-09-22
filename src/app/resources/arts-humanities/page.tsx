import { SectionHeader, SectionBody } from "@/components/resources/SectionPage";
import { getSectionContent } from "@/lib/resourceSections";

export const metadata = {
  title: "Arts & Humanities — Mesivta Library",
};

export default async function ArtsHumanitiesPage() {
  const content = await getSectionContent("arts-humanities");
  return (
    <div className="flex min-h-screen flex-col">
      <SectionHeader label="Arts & Humanities" />
      <SectionBody
        label="Arts & Humanities"
        description="Literature, history, languages and the arts."
        content={content}
      />
    </div>
  );
}
