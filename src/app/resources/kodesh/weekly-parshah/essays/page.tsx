import { KodeshSheetSection } from "@/components/kodesh/KodeshSheetSection";

export const metadata = {
  title: "Thematic Essays — Rabbi Osher Baddiel",
};

export default function EssaysPage() {
  return (
    <KodeshSheetSection
      title="Thematic Essays"
      description="Longer pieces exploring Shabbos, faith, Jewish history, and Torah values."
      sheets={[
        {
          title: "Va-es-channan — Shabbos, Dual Foundation of Our Faith",
          description: "A four-page essay on Shabbos as a foundation of faith, creation, responsibility, and human dignity.",
          href: "/kodesh/vaes-channan-thematic-essay.pdf",
        },
      ]}
    />
  );
}
