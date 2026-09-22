import { KodeshSheetSection } from "@/components/kodesh/KodeshSheetSection";

export const metadata = {
  title: "Sidra of the Week — Rabbi Osher Baddiel",
};

export default function SidraPage() {
  return (
    <KodeshSheetSection
      title="Sidra of the Week"
      description="Explanatory notes, diagrams, and learning material for the weekly Sidra."
      sheets={[
        {
          title: "Bemidbor — Sidra of the Week",
          description: "Notes on the counting, the camp, the Levites, and the movement of the Mishkan.",
          href: "/kodesh/bemidbor-sidra-notes.pdf",
        },
        {
          title: "Va-es-channan — Sidra of the Week",
          description: "Explanatory notes and learning material for Sidra Va-es-channan.",
          href: "/kodesh/vaes-channan-sidra-notes.pdf",
        },
      ]}
    />
  );
}
