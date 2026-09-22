import { KodeshSheetSection } from "@/components/kodesh/KodeshSheetSection";

export const metadata = {
  title: "Questions for the Sidra — Rabbi Osher Baddiel",
};

export default function QuestionsPage() {
  return (
    <KodeshSheetSection
      title="Questions for the Sidra"
      description="Thought-provoking questions for personal study, chavrusa discussion, or a class conversation."
      sheets={[
        {
          title: "Bemidbor — Questions for the Sidra",
          description: "Questions on the counting of Bnei Yisroel, the camp, the Levi’im, and the weekly Haftarah.",
          href: "/kodesh/bemidbor-questions.pdf",
        },
        {
          title: "Va-es-channan — Questions for the Sidra",
          description: "Questions for discussion and personal study on Sidra Va-es-channan.",
          href: "/kodesh/vaes-channan-questions.pdf",
        },
      ]}
    />
  );
}
