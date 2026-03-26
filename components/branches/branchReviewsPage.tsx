"use client";

import clsx from "clsx";
import { type ReactNode, useMemo, useState } from "react";
import {
  CustomTable,
  Modal,
  StatusBadge,
  type CustomTableAction,
  type CustomTableColumn,
} from "@/components/ui";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type { BranchDetail, BranchReview } from "./types";

type BranchReviewsPageProps = {
  branch: BranchDetail;
};

type BranchReviewsContentProps = {
  branch: BranchDetail;
};

type ReviewFilter = "all" | "featured" | "flagged";

const tableHeaderClassName =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle";

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

function getReviewActivityLabel(status: BranchReview["status"]) {
  return status === "flagged" ? "Inactive" : "Active";
}

function getReviewActivityTone(status: BranchReview["status"]) {
  return status === "flagged" ? ("neutral" as const) : ("success" as const);
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-subtle">
        {label}
      </p>
      <p className="mt-2 text-[14px] font-medium text-text-primary">{value}</p>
    </div>
  );
}

function ReviewDetailModal({
  review,
  onClose,
}: {
  review: BranchReview;
  onClose: () => void;
}) {
  return (
    <Modal
      title={review.title}
      onClose={onClose}
      panelClassName="max-w-[720px]"
      bodyClassName="mt-6 space-y-6"
    >
      <div className="flex flex-col gap-3 rounded-[20px] border border-border-soft bg-bg-muted px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[18px] font-semibold text-text-primary">{review.author}</p>
          <p className="mt-1 text-[14px] text-text-secondary">{review.postedAt}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={`${review.rating.toFixed(1)} rating`} tone="brand" />
          <StatusBadge
            label={getReviewActivityLabel(review.status)}
            tone={getReviewActivityTone(review.status)}
          />
          <StatusBadge label={getReviewLabel(review.status)} tone={getReviewTone(review.status)} />
        </div>
      </div>

      <div className="rounded-[20px] border border-border-soft bg-bg-surface px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-subtle">
          Review
        </p>
        <p className="mt-3 text-[15px] leading-[1.8] text-text-primary">{review.text}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailItem label="Name" value={review.author} />
        <DetailItem label="Title" value={review.title} />
        <DetailItem label="Added" value={review.postedAt} />
        <DetailItem label="Source" value={review.source} />
      </div>
    </Modal>
  );
}

function ReviewMobileCard({
  review,
  actionsMenu,
}: {
  review: BranchReview;
  actionsMenu: ReactNode;
}) {
  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-text-primary">{review.title}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{review.author}</p>
        </div>
        <div className="flex items-start gap-2">
          <StatusBadge label={`${review.rating.toFixed(1)}`} tone="brand" />
          <StatusBadge
            label={getReviewActivityLabel(review.status)}
            tone={getReviewActivityTone(review.status)}
          />
          {actionsMenu}
        </div>
      </div>

      <p className="mt-4 overflow-hidden text-[14px] leading-[1.7] text-text-primary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
        {review.text}
      </p>
      <p className="mt-4 text-[13px] text-text-secondary">{review.postedAt}</p>
    </article>
  );
}

export function BranchReviewsContent({
  branch,
}: BranchReviewsContentProps) {
  const [reviews, setReviews] = useState<BranchReview[]>(() =>
    cloneReviews(branch.reputation.reviews),
  );
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const featuredCount = reviews.filter((review) => review.status === "featured").length;
  const flaggedCount = reviews.filter((review) => review.status === "flagged").length;
  const activeCount = reviews.filter((review) => review.status !== "flagged").length;
  const inactiveCount = reviews.filter((review) => review.status === "flagged").length;

  const filteredReviews = useMemo(() => {
    if (activeFilter === "featured") {
      return reviews.filter((review) => review.status === "featured");
    }

    if (activeFilter === "flagged") {
      return reviews.filter((review) => review.status === "flagged");
    }

    return reviews;
  }, [activeFilter, reviews]);

  const filterOptions: Array<{
    value: ReviewFilter;
    label: string;
    count: number;
  }> = [
    { value: "all", label: "All", count: reviews.length },
    { value: "featured", label: "Featured", count: featuredCount },
    { value: "flagged", label: "Flagged", count: flaggedCount },
  ];

  const averageRatingLabel = branch.reputation.reviewCount
    ? branch.reputation.ratingAverage.toFixed(1)
    : "--";
  const selectedReview = selectedReviewId
    ? reviews.find((review) => review.id === selectedReviewId) ?? null
    : null;

  const reviewColumns = useMemo<CustomTableColumn<BranchReview>[]>(
    () => [
      {
        id: "review",
        header: "Review",
        isRowHeader: true,
        headerClassName: "w-full",
        cell: (review) => (
          <p className="overflow-hidden text-[14px] leading-[1.75] text-text-primary [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {review.text}
          </p>
        ),
      },
      {
        id: "rating",
        header: "Rating",
        sortable: true,
        sortAccessor: (review) => review.rating,
        accessorFn: (review) => review.rating.toFixed(1),
        className: "w-[88px] whitespace-nowrap font-medium",
        headerClassName: "w-[88px] whitespace-nowrap",
      },
      {
        id: "author",
        header: "Name",
        sortable: true,
        accessorKey: "author",
        className: "w-[132px] whitespace-nowrap",
        headerClassName: "w-[132px] whitespace-nowrap",
      },
      {
        id: "status",
        header: "Status",
        sortable: true,
        sortAccessor: (review) => getReviewActivityLabel(review.status),
        cell: (review) => (
          <StatusBadge
            label={getReviewActivityLabel(review.status)}
            tone={getReviewActivityTone(review.status)}
          />
        ),
        className: "w-[120px] whitespace-nowrap",
        headerClassName: "w-[120px] whitespace-nowrap",
      },
      {
        id: "title",
        header: "Title",
        sortable: true,
        accessorKey: "title",
        className: "w-[180px] whitespace-nowrap",
        headerClassName: "w-[180px] whitespace-nowrap",
      },
      {
        id: "postedAt",
        header: "Added",
        accessorKey: "postedAt",
        className: "w-[136px] whitespace-nowrap text-text-secondary",
        headerClassName: "w-[136px] whitespace-nowrap",
      },
    ],
    [],
  );

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

  const reviewActions = useMemo<CustomTableAction<BranchReview>[]>(
    () => [
      {
        label: "View detail",
        onSelect: (review) => setSelectedReviewId(review.id),
      },
      {
        label: "Feature",
        hidden: (review) => review.status === "featured",
        onSelect: (review) => toggleFeatured(review.id),
      },
      {
        label: "Remove feature",
        hidden: (review) => review.status !== "featured",
        onSelect: (review) => toggleFeatured(review.id),
      },
      {
        label: "Flag",
        hidden: (review) => review.status === "flagged",
        onSelect: (review) => toggleFlagged(review.id),
      },
      {
        label: "Clear flag",
        hidden: (review) => review.status !== "flagged",
        onSelect: (review) => toggleFlagged(review.id),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-border-soft bg-bg-surface px-5 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className={tableHeaderClassName}>Average</p>
              <p className="mt-1 text-[26px] font-semibold tracking-[-0.04em] text-text-primary">
                {averageRatingLabel}
              </p>
            </div>
            <div>
              <p className={tableHeaderClassName}>Active</p>
              <p className="mt-1 text-[26px] font-semibold tracking-[-0.04em] text-text-primary">
                {activeCount}
              </p>
            </div>
            <div>
              <p className={tableHeaderClassName}>Inactive</p>
              <p className="mt-1 text-[26px] font-semibold tracking-[-0.04em] text-text-primary">
                {inactiveCount}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={clsx(
                  "inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-colors",
                  activeFilter === filter.value
                    ? "border-border-brand bg-bg-brand-soft text-text-brand"
                    : "border-border-soft text-text-secondary hover:border-border-strong hover:text-text-primary",
                )}
              >
                <span>{filter.label}</span>
                <span className="text-[12px] opacity-80">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <CustomTable
        data={filteredReviews}
        columns={reviewColumns}
        rowActions={reviewActions}
        rowActionsColumnLabel="Action"
        getRowId={(review) => review.id}
        getRowLabel={(review) => review.title}
        caption={`${branch.name} reviews table. Review text, ratings, names, statuses, titles, added dates, and row actions.`}
        renderMobileCard={(review, { actionsMenu }) => (
          <ReviewMobileCard review={review} actionsMenu={actionsMenu} />
        )}
        emptyStateTitle="No reviews match this filter"
        emptyStateDescription="Switch filters to review more feedback."
        itemLabel="reviews"
        initialPageSize={6}
        pageSizeOptions={[6, 12, 18]}
      />

      {selectedReview ? (
        <ReviewDetailModal review={selectedReview} onClose={() => setSelectedReviewId(null)} />
      ) : null}
    </div>
  );
}

export function BranchReviewsPage({ branch }: BranchReviewsPageProps) {
  return (
    <BranchWorkspaceLayout branch={branch} activeSection="reviews">
      <BranchReviewsContent branch={branch} />
    </BranchWorkspaceLayout>
  );
}
