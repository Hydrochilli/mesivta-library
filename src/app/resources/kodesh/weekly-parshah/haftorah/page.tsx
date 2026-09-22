import { KodeshSheetSection } from "@/components/kodesh/KodeshSheetSection";

export const metadata = {
  title: "Haftarah Notes — Rabbi Osher Baddiel",
};

export default function HaftarahPage() {
  return (
    <KodeshSheetSection
      title="Haftarah Notes"
      description="Context, themes, and connections between the Haftarah and the weekly Sidra."
      sheets={[
        {
          title: "Bemidbor — Haftarah",
          description: "Notes on Hoshe’a and the connection between the Haftarah and Sidra Bemidbor.",
          href: "/kodesh/bemidbor-haftorah.pdf",
        },
        {
          title: "Va-es-channan — Haftarah",
          description: "Haftarah notes and the connection between the Haftarah and Sidra Va-es-channan.",
          href: "/kodesh/vaes-channan-haftorah.pdf",
        },
      ]}
    />
  );
}
