"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GALLERY_COLUMNS, GALLERY_MEDIA } from "@/components/gallery/data";
import { GalleryLightbox, GalleryHeader, MasonryGallery } from "@/components/gallery/organisms";

function parseSelectedMediaIndex(mediaParam: string | null, totalCount: number) {
  if (!mediaParam) {
    return null;
  }

  const mediaIndex = Number.parseInt(mediaParam, 10);

  if (!Number.isInteger(mediaIndex) || mediaIndex < 0 || mediaIndex >= totalCount) {
    return null;
  }

  return mediaIndex;
}

export function GalleryPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalCount = GALLERY_MEDIA.length;
  const selectedMediaIndex = parseSelectedMediaIndex(searchParams.get("media"), totalCount);
  const selectedMedia = selectedMediaIndex === null ? null : GALLERY_MEDIA[selectedMediaIndex];
  const selectedMediaPosition = selectedMediaIndex === null ? null : selectedMediaIndex + 1;

  const tileIndexMap = useMemo(
    () => new Map(GALLERY_MEDIA.map((media, index) => [media.id, index])),
    [],
  );

  const buildGalleryUrl = useCallback(
    (mediaIndex: number | null) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (mediaIndex === null) {
        nextParams.delete("media");
      } else {
        nextParams.set("media", String(mediaIndex));
      }

      const queryString = nextParams.toString();

      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [pathname, searchParams],
  );

  const handleCloseOverlay = useCallback(() => {
    router.replace(buildGalleryUrl(null), { scroll: false });
  }, [buildGalleryUrl, router]);

  const showMediaAtIndex = useCallback(
    (index: number) => {
      router.replace(buildGalleryUrl(index), { scroll: false });
    },
    [buildGalleryUrl, router],
  );

  const handleNextMedia = useCallback(() => {
    if (selectedMediaIndex === null) {
      return;
    }

    const nextIndex = (selectedMediaIndex + 1) % totalCount;
    showMediaAtIndex(nextIndex);
  }, [selectedMediaIndex, showMediaAtIndex, totalCount]);

  const handlePreviousMedia = useCallback(() => {
    if (selectedMediaIndex === null) {
      return;
    }

    const previousIndex = (selectedMediaIndex - 1 + totalCount) % totalCount;
    showMediaAtIndex(previousIndex);
  }, [selectedMediaIndex, showMediaAtIndex, totalCount]);

  const getTileHref = useCallback(
    (tile: (typeof GALLERY_MEDIA)[number]) => {
      const mediaIndex = tileIndexMap.get(tile.id);

      if (mediaIndex === undefined) {
        return pathname;
      }

      return buildGalleryUrl(mediaIndex);
    },
    [buildGalleryUrl, pathname, tileIndexMap],
  );

  return (
    <div className="min-h-screen bg-bg-surface">
      <main className="w-full md:px-6 md:py-6">
        <div className="w-full">
          <GalleryHeader className="sticky top-0 z-20 h-[56px] border-b border-border-soft bg-bg-surface px-4 md:static md:z-auto md:h-auto md:border-b-0 md:bg-transparent md:px-0" />
          <MasonryGallery
            columns={GALLERY_COLUMNS}
            getTileHref={getTileHref}
            className="mt-1 px-4 pb-8 md:mt-6 md:px-0 md:pb-0"
          />
        </div>
      </main>

      {selectedMedia && selectedMediaPosition ? (
        <GalleryLightbox
          media={selectedMedia}
          currentIndex={selectedMediaPosition}
          totalCount={totalCount}
          onClose={handleCloseOverlay}
          onPrevious={handlePreviousMedia}
          onNext={handleNextMedia}
        />
      ) : null}
    </div>
  );
}
