import type { Metadata } from "next";
import { BranchPublicIndexPage, getPublicBranchesIndex } from "@/components/branches";

export const metadata: Metadata = {
  title: "GymDeck Locations",
  description: "Published GymDeck branch listings powered by the shared branch domain model.",
};

export default function PublicLocationsRoute() {
  return <BranchPublicIndexPage branches={getPublicBranchesIndex()} />;
}
