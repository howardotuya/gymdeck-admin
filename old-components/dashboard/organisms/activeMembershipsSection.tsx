"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { TagPill } from "@/components/dashboard/atoms";
import { MEMBERSHIP_HISTORY_LABEL } from "@/components/dashboard/data";
import {
  MembershipCarouselControls,
  MembershipStat,
} from "@/components/dashboard/molecules";
import type { MembershipCard } from "@/components/dashboard/types";
import { HistoryFillIcon, MapPinFillIcon } from "@/components/icons";
import { useModalStore } from "@/stores/useModalStore";

type ActiveMembershipsSectionProps = {
  memberships: MembershipCard[];
};

export function ActiveMembershipsSection({
  memberships,
}: ActiveMembershipsSectionProps) {
  const openModal = useModalStore((state) => state.openModal);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeMembershipIndex, setActiveMembershipIndex] = useState(0);
  const lastMembershipIndex = Math.max(0, memberships.length - 1);
  const currentMembershipIndex = Math.min(
    Math.max(activeMembershipIndex, 0),
    lastMembershipIndex,
  );

  const scrollToMembership = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const nextIndex = Math.min(Math.max(index, 0), lastMembershipIndex);
    const nextCard = carousel.children.item(nextIndex);

    if (nextCard instanceof HTMLElement) {
      nextCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }

    setActiveMembershipIndex(nextIndex);
  };

  const handleCarouselScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const firstCard = carousel.firstElementChild;
    if (!(firstCard instanceof HTMLElement)) {
      return;
    }

    const cardWidth = firstCard.getBoundingClientRect().width;
    const computedStyle = getComputedStyle(carousel);
    const gap = Number.parseFloat(
      computedStyle.columnGap || computedStyle.gap || "0",
    );
    const cardStep = cardWidth + gap;

    if (cardStep <= 0) {
      return;
    }

    const nextIndex = Math.round(carousel.scrollLeft / cardStep);
    setActiveMembershipIndex(
      Math.min(Math.max(nextIndex, 0), lastMembershipIndex),
    );
  };

  const goToPreviousMembership = () => {
    scrollToMembership(currentMembershipIndex - 1);
  };

  const goToNextMembership = () => {
    scrollToMembership(currentMembershipIndex + 1);
  };

  const canGoPrevious = currentMembershipIndex > 0;
  const canGoNext = currentMembershipIndex < lastMembershipIndex;

  const handleRenewMembership = (membership: MembershipCard) => {
    openModal("renewMembership", {
      membershipTitle: membership.title,
      gymName: membership.gymName,
      renewalPriceLabel: membership.renewalPriceLabel,
      renewalPriceSuffix: "per month",
      currentExpiry: membership.validUntil,
      newExpiry: membership.renewedUntil,
      imageSrc: membership.imageSrc,
    });
  };

  const handleManageMembership = (membership: MembershipCard) => {
    openModal("manageMembership", {
      membershipId: membership.id,
      gymName: membership.gymName,
      facilityName: "FitZone Gym",
      imageSrc: membership.imageSrc,
      distanceLabel: "0.8 km away",
      ratingLabel: "4.8 (129)",
      scheduleLabel: "Mondays - Saturday, 8:am - 7pm",
      addressLabel: "123 Fitness Street, Lagos",
      directionsUrl:
        "https://www.google.com/maps/search/?api=1&query=123+Fitness+Street,+Lagos",
      phoneLabel: "+234 123 456 7890",
      phoneNumber: "+2341234567890",
      cancellationPolicy:
        "You can cancel your membership any time before your next billing date. Access remains active until the end of your current cycle, and unused sessions in the cycle are non-refundable.",
    });
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] md:text-[20px] leading-[1.4] font-semibold text-text-primary">
          Active Memberships
        </h2>
        <MembershipCarouselControls
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPrevious={goToPreviousMembership}
          onNext={goToNextMembership}
        />
      </header>

      <div
        ref={carouselRef}
        onScroll={handleCarouselScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {memberships.map((membership) => (
          <article
            key={membership.id}
            className="relative flex h-[424px] pt-6 w-full min-w-full snap-start flex-col items-start justify-end overflow-hidden rounded-[17px] bg-bg-membership-card md:min-w-[749px]"
          >
            <div className="relative w-full overflow-hidden rounded-[16px] p-6 shadow-[0px_-5px_20.9px_0px_var(--shadow-membership-glow)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[16px]"
              >
                <Image
                  src={membership.imageSrc}
                  alt=""
                  fill
                  className="rounded-[16px] object-cover"
                  sizes="(max-width: 768px) 100vw, 749px"
                />
                <div
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    backgroundImage: "var(--bg-membership-overlay-gradient)",
                  }}
                />
              </div>

              <div className="relative flex flex-col gap-6 text-text-inverse">
                <TagPill className="w-fit px-3 py-[6px] text-[12px] leading-normal">
                  {membership.badge}
                </TagPill>

                <div className="space-y-2">
                  <h3 className="text-[24px] leading-[1.4] font-semibold">
                    {membership.title}
                  </h3>
                  <p className="inline-flex items-center gap-2 text-[14px] leading-normal font-medium text-text-inverse">
                    <MapPinFillIcon className="size-5 text-text-inverse" />
                    {membership.gymName}
                  </p>
                </div>

                <div className="space-y-6 rounded-2xl bg-bg-membership-glass px-[22px] py-[21px] backdrop-blur-[39.15px]">
                  <div className="flex items-start justify-between gap-4">
                    <MembershipStat
                      label="Valid Until"
                      value={membership.validUntil}
                    />
                    <MembershipStat
                      label="Classes Remaining"
                      value={membership.classesRemaining}
                    />
                  </div>

                  <div className="h-[9px] w-full overflow-hidden rounded-full bg-text-inverse/12">
                    <div
                      className="h-full rounded-full bg-text-inverse"
                      style={{ width: `${membership.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        handleRenewMembership(membership);
                      }}
                      className="inline-flex h-[51px] flex-1 items-center justify-center rounded-full bg-bg-surface px-[10px] text-[14px] font-medium text-brand-primary"
                    >
                      Renew
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleManageMembership(membership);
                      }}
                      className="inline-flex h-[51px] flex-1 items-center justify-center rounded-full bg-text-inverse/16 px-[10px] text-[14px] font-medium text-text-inverse"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Link
        href="/dashboard/membership-history"
        className="inline-flex items-center gap-1 text-[14px] leading-[1.4] text-text-brand transition-colors hover:text-brand-primary"
      >
        <HistoryFillIcon className="size-5" />
        {MEMBERSHIP_HISTORY_LABEL}
      </Link>
    </section>
  );
}
