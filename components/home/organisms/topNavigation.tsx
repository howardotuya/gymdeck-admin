"use client";

import Image from "next/image";
import clsx from "clsx";
import {
  ArrowDownSLineIcon,
  ArrowRightSLineIcon,
  HeartLineIcon,
  MapPin2LineIcon,
  Notification3LineIcon,
  Search2LineIcon,
  ShareBoxFillIcon,
  StarFillIcon,
} from "@/components/icons";
import { GYM_NAME } from "@/components/home/data";
import { BrandLogo } from "@/components/logo";
import { useModalStore } from "@/stores/useModalStore";

const NAV_LINKS = ["Discover", "My Passes", "My Wallet"];

type PageActionsProps = {
  className?: string;
};

export function PageActions({ className }: PageActionsProps) {
  const openModal = useModalStore((state) => state.openModal);

  const openShareModal = () => {
    openModal("shareGym", {
      gymName: GYM_NAME,
      shareUrl: window.location.href,
    });
  };

  const openLeaveReviewModal = () => {
    openModal("leaveReview", {
      gymName: GYM_NAME,
    });
  };

  return (
    <div className={clsx("flex items-center gap-4 text-[14px] leading-[1.4]", className)}>
      <button
        type="button"
        onClick={openShareModal}
        className="inline-flex items-center gap-2 text-text-support transition-colors hover:text-text-primary"
      >
        <ShareBoxFillIcon className="size-6 text-text-brand" />
        Share
      </button>
      <button
        type="button"
        onClick={openLeaveReviewModal}
        className="inline-flex items-center gap-2 text-text-support transition-colors hover:text-text-primary"
      >
        <StarFillIcon className="size-6 text-text-brand" />
        Leave a review
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 text-text-support transition-colors hover:text-text-primary"
      >
        <HeartLineIcon className="size-6 text-text-brand" />
        Save
      </button>
    </div>
  );
}

export function DesktopTopNavigation() {
  return (
    <header className="hidden border-b border-border-soft bg-bg-surface md:block">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <BrandLogo
            imageClassName="h-[15.93px] w-[28.44px] object-contain"
            textClassName="sr-only"
            wrapperClassName="gap-0"
          />
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link}
                href="#"
                className={clsx(
                  "text-[14px] leading-[1.4] transition-colors",
                  index === 0
                    ? "font-semibold text-text-brand"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <label className="flex h-10 w-full max-w-[348px] items-center gap-2 rounded-full bg-[var(--bg-control)] px-5">
          <Search2LineIcon className="size-5 text-text-support" />
          <input
            type="search"
            placeholder="Search gyms, locations..."
            className="w-full bg-transparent text-[14px] leading-[1.4] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </label>

        <div className="flex items-center gap-6">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-[7px] rounded-full bg-[var(--bg-control)] px-3 text-[14px] leading-[1.4] text-text-support"
          >
            <MapPin2LineIcon className="size-5 text-text-brand" />
            Victoria Island, Lagos
            <ArrowDownSLineIcon className="size-5 text-text-support" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full bg-bg-icon-soft transition-colors hover:bg-bg-subtle"
                aria-label="Saved places"
              >
                <HeartLineIcon className="size-5 text-text-brand" />
              </button>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full bg-bg-icon-soft transition-colors hover:bg-bg-subtle"
                aria-label="Notifications"
              >
                <Notification3LineIcon className="size-5 text-text-brand" />
              </button>
            </div>

            <span className="h-[25px] w-px bg-border-soft" aria-hidden="true" />

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-90"
              aria-label="Open profile"
            >
              <Image
                src="/assets/temp-gym-profile-image.png"
                alt="Profile"
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function MobileTopNavigation() {
  const openModal = useModalStore((state) => state.openModal);

  const openShareModal = () => {
    openModal("shareGym", {
      gymName: GYM_NAME,
      shareUrl: window.location.href,
    });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border-soft bg-bg-surface md:hidden">
      <div className="flex h-[56px] items-center justify-between px-4">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center -ml-2"
          aria-label="Go back"
        >
          <ArrowRightSLineIcon className="size-6 rotate-180 text-text-support" />
        </button>

        <div className="flex items-center gap-4 text-[14px] leading-[1.4]">
          <button
            type="button"
            onClick={openShareModal}
            className="inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-text-primary"
          >
            <ShareBoxFillIcon className="size-6 text-text-brand" />
            Share
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-text-primary"
          >
            <HeartLineIcon className="size-6 text-text-brand" />
            Save
          </button>
        </div>
      </div>
    </header>
  );
}
