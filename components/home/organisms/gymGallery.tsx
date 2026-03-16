import Image from "next/image";
import Link from "next/link";
import { DirectionsButton } from "@/components/home/molecules";

type GymGalleryProps = {
  images: string[];
};

export function GymGallery({ images }: GymGalleryProps) {
  const [heroImage, ...gridImages] = images;

  return (
    <>
      <div className="relative h-[495px] overflow-hidden md:hidden">
        <Image
          src={heroImage}
          alt="FitZone gym interior"
          fill
          className="object-cover object-center grayscale"
          priority
        />
        <span className="absolute right-4 top-5 rounded-full bg-bg-surface px-3 py-1.5 text-[14px] leading-[1.4] font-semibold text-text-support">
          1/24
        </span>
        <DirectionsButton compact className="absolute right-4 top-[304px] bg-bg-surface" />
      </div>

      <div className="hidden md:grid md:grid-cols-2 md:gap-5">
        <Link
          href="/gallery?media=0"
          aria-label="Open gallery image 1"
          className="relative aspect-[686/519] overflow-hidden rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/35"
        >
          <Image
            src={heroImage}
            alt="FitZone gym interior"
            fill
            className="object-cover grayscale"
            priority
          />
        </Link>

        <div className="grid grid-cols-2 gap-x-5 gap-y-[19px]">
          {gridImages.map((image, index) => {
            const isLast = index === gridImages.length - 1;
            const mediaHref = `/gallery?media=${index + 1}`;
            const tileToneClass = isLast
              ? "object-cover"
              : index === 1
                ? "object-cover grayscale"
                : index === 2
                  ? "object-cover saturate-75"
                  : "object-cover";
            return (
              <div
                key={`${image}-${index}`}
                className="relative aspect-[333/250] overflow-hidden rounded-[20px]"
              >
                {isLast ? null : (
                  <Link
                    href={mediaHref}
                    aria-label={`Open gallery image ${index + 2}`}
                    className="absolute inset-0 z-10 rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/35"
                  />
                )}
                <Image
                  src={image}
                  alt={`FitZone gallery image ${index + 2}`}
                  fill
                  className={tileToneClass}
                />
                {isLast ? (
                  <>
                    <div className="absolute inset-0 bg-bg-overlay-gallery" />
                    <Link
                      href="/gallery"
                      className="absolute inset-0 flex items-center justify-center text-[20px] leading-[1.4] font-semibold text-text-inverse"
                    >
                      +12 More
                    </Link>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
