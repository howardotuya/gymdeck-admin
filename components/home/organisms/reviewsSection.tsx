import { RatingStars, SectionHeading } from "@/components/home/atoms";
import type { RatingDistribution, Review } from "@/components/home/types";

type ReviewsSectionProps = {
  overallRating: string;
  overallReviewCount: number;
  distribution: RatingDistribution[];
  reviews: Review[];
};

export function ReviewsSection({
  distribution,
  overallRating,
  overallReviewCount,
  reviews,
}: ReviewsSectionProps) {
  return (
    <section className="space-y-8">
      <SectionHeading title="FitZone Gym Reviews" />

      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-end">
        <div className="space-y-2">
          <p className="text-[72px] leading-[1] font-semibold text-text-primary">{overallRating}</p>
          <RatingStars />
          <p className="text-[24px] leading-[1.2] text-text-support">
            {overallRating} ({overallReviewCount} reviews)
          </p>
        </div>

        <div className="space-y-3">
          {distribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              <span className="w-4 text-[14px] leading-[1.4] text-text-support">{item.stars}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-muted">
                <span
                  className="block h-full rounded-full bg-text-brand"
                  style={{ width: `${item.widthPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {reviews.map((review) => (
          <article key={review.id} className="space-y-2 border-b border-border-soft pb-6 last:border-b-0">
            <h4 className="text-[34px] leading-[1.2] font-semibold text-text-primary">{review.title}</h4>
            <div className="flex items-center gap-2">
              <RatingStars iconClassName="size-3" />
              <span className="text-[14px] leading-[1.4] text-text-secondary">1 hour ago</span>
            </div>
            <p className="max-w-4xl text-[15px] leading-[1.5] text-text-support">{review.text}</p>
            <p className="text-[14px] leading-[1.4] text-text-secondary">
              {review.author} • {review.postedAt}
            </p>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="inline-flex h-[42px] items-center justify-center rounded-full bg-bg-muted px-4 text-[14px] leading-[1.4] text-text-support transition-colors hover:text-text-primary"
      >
        See more reviews
      </button>
    </section>
  );
}
