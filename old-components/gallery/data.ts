import type { GalleryColumn, GalleryHeaderAction } from "./types";

const GALLERY_IMAGE = "/assets/temp-gym-image.jpg";

export const GALLERY_HEADER_ACTIONS: GalleryHeaderAction[] = [
  { id: "share", label: "Share" },
  { id: "save", label: "Save" },
];

export const GALLERY_COLUMNS: GalleryColumn[] = [
  {
    id: "column-a",
    tiles: [
      {
        id: "gallery-1",
        alt: "Gym gallery image 1",
        src: GALLERY_IMAGE,
        height: 579,
        mobileHeight: 359,
        priority: true,
      },
      {
        id: "gallery-2",
        alt: "Gym gallery image 2",
        src: GALLERY_IMAGE,
        height: 326,
        mobileHeight: 202,
      },
      {
        id: "gallery-3",
        alt: "Gym gallery image 3",
        src: GALLERY_IMAGE,
        height: 326,
        mobileHeight: 202,
      },
    ],
  },
  {
    id: "column-b",
    tiles: [
      {
        id: "gallery-4",
        alt: "Gym gallery image 4",
        src: GALLERY_IMAGE,
        height: 326,
        mobileHeight: 202,
      },
      {
        id: "gallery-5",
        alt: "Gym gallery image 5",
        src: GALLERY_IMAGE,
        height: 326,
        mobileHeight: 202,
      },
      {
        id: "gallery-6",
        alt: "Gym gallery image 6",
        src: GALLERY_IMAGE,
        height: 579,
        mobileHeight: 359,
      },
    ],
  },
  {
    id: "column-c",
    tiles: [
      {
        id: "gallery-7",
        alt: "Gym gallery image 7",
        src: GALLERY_IMAGE,
        height: 326,
        mobileHeight: 202,
      },
      {
        id: "gallery-8",
        alt: "Gym gallery image 8",
        src: GALLERY_IMAGE,
        height: 579,
        mobileHeight: 359,
      },
      {
        id: "gallery-9",
        alt: "Gym gallery image 9",
        src: GALLERY_IMAGE,
        height: 326,
        mobileHeight: 202,
      },
    ],
  },
];

export const GALLERY_MEDIA = GALLERY_COLUMNS.flatMap((column) => column.tiles);
