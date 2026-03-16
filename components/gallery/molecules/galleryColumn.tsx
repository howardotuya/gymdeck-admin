import clsx from "clsx";
import Link from "next/link";
import { GalleryTile } from "@/components/gallery/atoms";
import type { GalleryTile as GalleryTileType, GalleryTileHrefBuilder } from "@/components/gallery/types";

type GalleryColumnProps = {
  tiles: GalleryTileType[];
  getTileHref?: GalleryTileHrefBuilder;
  className?: string;
};

export function GalleryColumn({ className, getTileHref, tiles }: GalleryColumnProps) {
  return (
    <div className={clsx("flex flex-col gap-5", className)}>
      {tiles.map((tile) => {
        const tileElement = <GalleryTile tile={tile} />;
        const tileHref = getTileHref?.(tile);

        if (!tileHref) {
          return <GalleryTile key={tile.id} tile={tile} />;
        }

        return (
          <Link
            key={tile.id}
            href={tileHref}
            aria-label={`Open ${tile.alt}`}
            className="block rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/35"
          >
            {tileElement}
          </Link>
        );
      })}
    </div>
  );
}
