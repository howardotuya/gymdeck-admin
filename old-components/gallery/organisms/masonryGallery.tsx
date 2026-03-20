import clsx from "clsx";
import Link from "next/link";
import { GalleryTile } from "@/components/gallery/atoms";
import { GalleryColumn } from "@/components/gallery/molecules";
import type {
  GalleryColumn as GalleryColumnType,
  GalleryTile as GalleryTileType,
  GalleryTileHrefBuilder,
} from "@/components/gallery/types";

type MasonryGalleryProps = {
  columns: GalleryColumnType[];
  getTileHref?: GalleryTileHrefBuilder;
  className?: string;
};

export function MasonryGallery({ className, columns, getTileHref }: MasonryGalleryProps) {
  const renderMobileTile = (tile: GalleryTileType) => {
    const tileHref = getTileHref?.(tile);

    if (!tileHref) {
      return <GalleryTile key={`mobile-${tile.id}`} mobile tile={tile} />;
    }

    return (
      <Link
        key={`mobile-${tile.id}`}
        href={tileHref}
        aria-label={`Open ${tile.alt}`}
        className="block rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/35"
      >
        <GalleryTile mobile tile={tile} />
      </Link>
    );
  };

  return (
    <section className={clsx("w-full", className)}>
      <div className="flex flex-col gap-[19px] lg:hidden">
        {columns.map((column) => (
          <div key={`mobile-${column.id}`} className="flex flex-col gap-5">
            {column.tiles.map(renderMobileTile)}
          </div>
        ))}
      </div>

      <div className="hidden w-full gap-x-[19px] lg:grid lg:grid-cols-3">
        {columns.map((column) => (
          <GalleryColumn key={column.id} tiles={column.tiles} getTileHref={getTileHref} />
        ))}
      </div>
    </section>
  );
}
