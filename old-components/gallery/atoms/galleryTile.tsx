import clsx from "clsx";
import Image from "next/image";
import type { GalleryTile as GalleryTileType } from "@/components/gallery/types";

type GalleryTileProps = {
  tile: GalleryTileType;
  mobile?: boolean;
  className?: string;
};

export function GalleryTile({ className, mobile = false, tile }: GalleryTileProps) {
  const tileHeight = mobile ? tile.mobileHeight : tile.height;

  return (
    <div
      className={clsx("relative w-full overflow-hidden rounded-[20px]", className)}
      style={{ height: tileHeight }}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        priority={tile.priority}
        sizes={
          mobile ? "100vw" : "(min-width: 1500px) 451px, (min-width: 1024px) calc((100vw - 86px) / 3), 100vw"
        }
        className="object-cover grayscale"
      />
    </div>
  );
}
