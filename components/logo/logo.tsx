import clsx from "clsx";
import Image from "next/image";
import logo from "@/public/assets/logo.png";

type BrandLogoProps = {
  imageClassName?: string;
  textClassName?: string;
  wrapperClassName?: string;
};

export function BrandLogo({
  imageClassName,
  textClassName,
  wrapperClassName,
}: BrandLogoProps) {
  return (
    <div className={clsx("flex items-center gap-2", wrapperClassName)}>
      <Image
        src={logo}
        alt="GymDeck"
        width={32}
        height={18}
        className={clsx("h-[18px] w-[32px] object-contain", imageClassName)}
        priority
      />
      <span
        className={clsx(
          "text-[18px] font-semibold tracking-[-0.03em] text-text-primary",
          textClassName,
        )}
      >
        GymDeck
      </span>
    </div>
  );
}
