import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicBranchPage, getPublicBranchPageDataBySlug } from "@/components/branches";

type PublicBranchRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicBranchRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = getPublicBranchPageDataBySlug(slug);

  return {
    title: branch ? `${branch.name} | GymDeck` : "Branch listing | GymDeck",
    description: branch?.overviewShort,
  };
}

export default async function PublicBranchRoute({ params }: PublicBranchRouteProps) {
  const { slug } = await params;
  const branch = getPublicBranchPageDataBySlug(slug);

  if (!branch || !branch.isDiscoverable) {
    notFound();
  }

  return <PublicBranchPage branch={branch} />;
}
