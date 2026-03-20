import { notFound } from "next/navigation";
import { getSectionMeta, isKnownSection } from "@/components/app-shell";
import { PlaceholderPage } from "@/components/placeholder/placeholderPage";

type SectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

export default async function SectionPage({ params }: SectionPageProps) {
  const { section } = await params;

  if (!isKnownSection(section)) {
    notFound();
  }

  const meta = getSectionMeta(section);

  return (
    <PlaceholderPage
      title={meta.title}
      description={meta.description}
      eyebrow={meta.group}
    />
  );
}
