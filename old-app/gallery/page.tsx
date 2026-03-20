import { Suspense } from "react";
import { GalleryPage } from "@/components/gallery";

export default function Gallery() {
  return (
    <Suspense fallback={null}>
      <GalleryPage />
    </Suspense>
  );
}
