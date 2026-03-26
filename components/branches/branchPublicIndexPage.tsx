"use client";

import Image from "next/image";
import Link from "next/link";
import { OverviewCard, PageHeader, Panel, StatusBadge } from "@/components/ui";
import type { PublicBranchPageData } from "./publicBranchSelectors";

type BranchPublicIndexPageProps = {
  branches: PublicBranchPageData[];
};

function getPrimaryImage(branch: PublicBranchPageData) {
  return branch.heroImageUrl ?? branch.galleryImages[0];
}

export function BranchPublicIndexPage({ branches }: BranchPublicIndexPageProps) {
  const publishedBranches = branches.filter((branch) => branch.isDiscoverable);
  const averageRating =
    publishedBranches.length > 0
      ? (
          publishedBranches.reduce((total, branch) => total + branch.reviewAverage, 0) /
          publishedBranches.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-bg-surface text-text-primary">
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
        <PageHeader
          eyebrow="Public branches"
          title="GymDeck locations"
          description="Published branch listings backed by the shared branch domain model."
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            label="Published branches"
            value={publishedBranches.length.toString()}
            detail="Locations currently eligible and requested for discovery"
          />
          <OverviewCard
            label="Avg rating"
            value={averageRating}
            detail="Average across published branch review summaries"
          />
          <OverviewCard
            label="Visible plans"
            value={publishedBranches
              .reduce((total, branch) => total + branch.visiblePlans.length, 0)
              .toString()}
            detail="Branch pricing cards currently public"
          />
          <OverviewCard
            label="Weekly sessions"
            value={publishedBranches
              .reduce((total, branch) => total + branch.sessions.length, 0)
              .toString()}
            detail="Public schedule sessions across discoverable branches"
          />
        </section>

        <Panel
          eyebrow="Directory"
          title="Discoverable locations"
          description="Each card below links to the branch-backed public listing."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publishedBranches.map((branch) => {
              const imageUrl = getPrimaryImage(branch);

              return (
                <article
                  key={branch.id}
                  className="overflow-hidden rounded-[28px] border border-border-soft bg-bg-muted"
                >
                  {imageUrl ? (
                    <div className="relative h-[220px] w-full">
                      <Image
                        src={imageUrl}
                        alt={`${branch.name} branch`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="flex h-[220px] items-center justify-center bg-bg-surface text-[14px] text-text-secondary">
                      No gallery media
                    </div>
                  )}

                  <div className="space-y-4 px-5 py-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge label="Published" tone="success" />
                      <span className="inline-flex rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand">
                        {branch.reviewAverage.toFixed(1)} rating
                      </span>
                    </div>

                    <div>
                      <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-text-primary">
                        {branch.name}
                      </h2>
                      <p className="mt-2 text-[14px] leading-[1.7] text-text-secondary">
                        {branch.overviewShort}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-[18px] border border-border-soft bg-bg-surface px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                          Plans
                        </p>
                        <p className="mt-1 text-[14px] font-semibold text-text-primary">
                          {branch.visiblePlans.length}
                        </p>
                      </div>
                      <div className="rounded-[18px] border border-border-soft bg-bg-surface px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                          Sessions
                        </p>
                        <p className="mt-1 text-[14px] font-semibold text-text-primary">
                          {branch.sessions.length}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/locations/${branch.slug}`}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-primary px-4 text-[14px] font-semibold text-text-inverse transition-colors hover:bg-brand-primary-hover"
                    >
                      View public listing
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Panel>
      </main>
    </div>
  );
}
