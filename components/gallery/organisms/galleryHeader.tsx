import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { IconCircle } from "@/components/gallery/atoms";
import { GALLERY_HEADER_ACTIONS } from "@/components/gallery/data";
import { GalleryActionButton } from "@/components/gallery/molecules";
import type { GalleryActionId } from "@/components/gallery/types";
import { CloseFillIcon, HeartLineIcon, ShareBoxFillIcon } from "@/components/icons";

const ACTION_ICON_MAP: Record<GalleryActionId, ReactNode> = {
  share: <ShareBoxFillIcon className="size-6 text-text-brand" />,
  save: <HeartLineIcon className="size-6 text-text-brand" />,
};

type GalleryHeaderProps = {
  closeHref?: string;
  className?: string;
};

export function GalleryHeader({ className, closeHref = "/" }: GalleryHeaderProps) {
  return (
    <header className={clsx("flex items-center justify-between gap-4", className)}>
      <Link
        href={closeHref}
        className="inline-flex items-center gap-3 text-[14px] leading-[1.4] text-text-secondary transition-colors hover:text-text-primary"
      >
        <IconCircle>
          <CloseFillIcon className="size-5" />
        </IconCircle>
        Close
      </Link>

      <div className="flex items-center gap-4">
        {GALLERY_HEADER_ACTIONS.map((action) => (
          <GalleryActionButton
            key={action.id}
            icon={ACTION_ICON_MAP[action.id]}
            aria-label={action.label}
          >
            {action.label}
          </GalleryActionButton>
        ))}
      </div>
    </header>
  );
}
