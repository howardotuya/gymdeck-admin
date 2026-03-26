"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { OverviewCard, Panel, StatusBadge } from "@/components/ui";
import {
  primaryActionClassName,
  secondaryActionClassName,
} from "./branch-form-steps/shared";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type {
  BranchDetail,
  BranchReview,
} from "./types";

type BranchReviewsPageProps = {
  branch: BranchDetail;
};

type ReviewFilter = "all" | "featured" | "flagged";

function cloneReviews(reviews: BranchReview[]) {
  return reviews.map((review) => ({ ...review }));
}

function getReviewTone(status: BranchReview["status"]) {
  if (status === "featured") {
    return "success" as const;
  }

  if (status === "flagged") {
    return "warning" as const;
  }

  return "neutral" as const;
}

function getReviewLabel(status: BranchReview["status"]) {
  if (status === "featured") {
    return "Featured";
  }

  if (status === "flagged") {
    return "Flagged";
  }

  return "Published";
}

export function BranchReviewsPage({ branch }: BranchReviewsPageProps) {
  const [reviews, setReviews] = useState<BranchReview[]>(() =>
    cloneReviews(branch.reputation.reviews),
  );
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");

  const isDirty = useMemo(
    () => JSON.stringify(reviews) !== JSON.stringify(branch.reputation.reviews),
    [branch.reputation.reviews, reviews],
  );

  const featuredCount = reviews.filter((review) => review.status === "featured").length;
  const flaggedCount = reviews.filter((review) => review.status === "flagged").length;
  const publishedCount = reviews.filter((review) => review.status === "published").length;

  const filteredReviews = useMemo(() => {
    if (activeFilter === "featured") {
      return reviews.filter((review) => review.status === "featured");
    }

    if (activeFilter === "flagged") {
      return reviews.filter((review) => review.status === "flagged");
    }

    return reviews;
  }, [activeFilter, reviews]);

  const resetChanges = () => {
    setReviews(cloneReviews(branch.reputation.reviews));
    setActiveFilter("all");
  };

  const handleSave = () => {
    toast.success(`${branch.name} review moderation changes are staged for review.`);
  };

  const toggleFeatured = (reviewId: string) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) => {
        if (review.id !== reviewId) {
          return review;
        }

        return {
          ...review,
          status: review.status === "featured" ? "published" : "featured",
        };
      }),
    );
  };

  const toggleFlagged = (reviewId: string) => {
    setReviews((currentReviews) =>
      currentReviews.map((review) => {
        if (review.id !== reviewId) {
          return review;
        }

        return {
          ...review,
          status: review.status === "flagged" ? "published" : "flagged",
        };
      }),
    );
  };

  return (
    <BranchWorkspaceLayout
      branch={branch}
      activeSection="reviews"
      pageLabel="Reviews"
      description="Monitor review health, highlight social proof, and surface moderation issues before they affect the branch listing."
      action={
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <StatusBadge
            label={flaggedCount ? "Needs review" : "Healthy"}
            tone={flaggedCount ? "warning" : "success"}
          />
          <button
            type="button"
            onClick={resetChanges}
            disabled={!isDirty}
            className={clsx(secondaryActionClassName, !isDirty && "opacity-60")}
          >
            Reset changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={primaryActionClassName}
          >
            Save review state
          </button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          label="Average rating"
          value={
            branch.reputation.reviewCount
              ? branch.reputation.ratingAverage.toFixed(1)
              : "No reviews"
          }
          detail={`${branch.reputation.reviewCount} tracked reviews`}
        />
        <OverviewCard
          label="Featured"
          value={featuredCount.toString()}
          detail="Highlighted on member-facing review surfaces"
        />
        <OverviewCard
          label="Flagged"
          value={flaggedCount.toString()}
          detail="Needs moderation or closer review"
        />
        <OverviewCard
          label="Published"
          value={publishedCount.toString()}
          detail="Visible but not highlighted"
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <div className="space-y-4">
          <Panel
            eyebrow="Moderation"
            title="Review queue"
            description="Filter reviews by moderation state and decide which ones deserve extra prominence."
            action={
              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "All"],
                  ["featured", "Featured"],
                  ["flagged", "Flagged"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setActiveFilter(value as ReviewFilter)}
                    className={clsx(
                      "inline-flex h-10 items-center justify-center rounded-full px-4 text-[13px] font-semibold transition-colors",
                      activeFilter === value
                        ? "bg-brand-primary text-text-inverse"
                        : "border border-border-soft bg-bg-surface text-text-primary",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            }
          >
            <div className="space-y-4">
              {filteredReviews.length ? (
                filteredReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-[24px] border border-border-soft bg-bg-muted p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[16px] font-semibold text-text-primary">
                            {review.title}
                          </p>
                          <StatusBadge
                            label={`${review.rating.toFixed(1)} stars`}
                            tone="brand"
                          />
                          <StatusBadge
                            label={getReviewLabel(review.status)}
                            tone={getReviewTone(review.status)}
                          />
                        </div>
                        <p className="mt-2 text-[13px] text-text-secondary">
                          {review.author} • {review.postedAt} • {review.source}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-[14px] leading-[1.7] text-text-secondary">
                      {review.text}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(review.id)}
                        className={clsx(
                          secondaryActionClassName,
                          review.status === "featured" && "border-border-brand text-text-brand",
                        )}
                      >
                        {review.status === "featured" ? "Remove featured" : "Mark featured"}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFlagged(review.id)}
                        className={clsx(
                          secondaryActionClassName,
                          review.status === "flagged" && "border-[#fda29b] text-text-danger",
                        )}
                      >
                        {review.status === "flagged" ? "Clear flag" : "Flag for review"}
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-border-strong px-4 py-5 text-[14px] text-text-secondary">
                  No reviews match the current filter.
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel
            eyebrow="Distribution"
            title="Rating mix"
            description="Track how each rating bucket contributes to the branch’s public score."
          >
            <div className="space-y-3">
              {branch.reputation.reviewSummary.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="w-3 text-[13px] font-medium text-text-primary">
                    {item.stars}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-primary"
                      style={{ width: `${item.widthPercent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-[12px] text-text-secondary">
                    {item.widthPercent}%
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Sources"
            title="External review links"
            description="These are the source destinations already associated with this branch."
          >
            <div className="space-y-3">
              {branch.reputation.externalReviewLinks.length ? (
                branch.reputation.externalReviewLinks.map((item) => (
                  <div
                    key={item.href}
                    className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
                  >
                    <p className="text-[14px] font-semibold text-text-primary">{item.label}</p>
                    <p className="mt-2 break-all text-[13px] leading-[1.65] text-text-secondary">
                      {item.href}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-border-strong px-4 py-5 text-[14px] text-text-secondary">
                  No external review sources have been linked yet.
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </BranchWorkspaceLayout>
  );
}
