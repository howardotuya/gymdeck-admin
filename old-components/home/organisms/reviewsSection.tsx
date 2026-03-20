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
    <section className="space-y-10">
      <div className="space-y-8">
        <SectionHeading title="FitZone Gym Reviews" />

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-14">
          <div className="space-y-2">
            <p className="text-[40px] leading-[1.5] font-semibold text-text-primary">{overallRating}</p>
            <div className="space-y-1">
              <RatingStars iconClassName="size-4" />
              <p className="text-[16px] leading-[1.4] text-text-primary">
                {overallRating} ({overallReviewCount} reviews)
              </p>
            </div>
          </div>

          <div className="w-[239px] space-y-px">
            {distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="w-[9px] text-[14px] leading-[1.5] text-text-emphasis">
                  {item.stars}
                </span>
                <div className="h-[7px] w-[222px] overflow-hidden rounded-full bg-bg-action-soft">
                  {item.widthPercent > 0 ? (
                    <span
                      className="block h-full rounded-full bg-text-brand"
                      style={{ width: `${item.widthPercent}%` }}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {reviews.map((review) => (
          <article key={review.id} className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-[18px] leading-[1.4] font-semibold text-text-primary">{review.title}</h4>
              <div className="flex items-center gap-3">
                <RatingStars iconClassName="size-4" />
                <span className="text-[14px] leading-[1.5] text-text-support">1 hour ago</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="w-full text-[14px] leading-[1.5] text-text-support md:text-[16px]">
                {review.text}
              </p>
              <div className="inline-flex items-center gap-2">
                <span className="text-[14px] leading-[1.4] text-text-secondary">{review.author}</span>
                <span className="size-1 shrink-0 rounded-full bg-text-muted" aria-hidden="true" />
                <span className="text-[14px] leading-[1.4] text-text-secondary">{review.postedAt}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="inline-flex h-[51px] items-center justify-center rounded-full bg-bg-muted px-5 text-[14px] leading-normal font-medium text-text-support transition-colors hover:text-text-primary"
      >
        See more reviews
      </button>
    </section>
  );
}
