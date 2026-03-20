import { RatingStars } from "@/components/home/atoms";

type RatingInlineProps = {
  rating: string;
  reviewCount: number;
  className?: string;
};

export function RatingInline({ className, rating, reviewCount }: RatingInlineProps) {
  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2">
        <RatingStars />
        <p className="text-[14px] leading-[1.4] text-text-primary md:text-[16px]">
          {rating} ({reviewCount} reviews)
        </p>
      </div>
    </div>
  );
}
