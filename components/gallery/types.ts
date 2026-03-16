export type GalleryActionId = "share" | "save";

export type GalleryHeaderAction = {
  id: GalleryActionId;
  label: string;
};

export type GalleryTile = {
  id: string;
  alt: string;
  src: string;
  height: number;
  mobileHeight: number;
  priority?: boolean;
};

export type GalleryColumn = {
  id: string;
  tiles: GalleryTile[];
};

export type GalleryTileHrefBuilder = (tile: GalleryTile) => string;
