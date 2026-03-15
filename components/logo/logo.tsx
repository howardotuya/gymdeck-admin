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
    <div
      className={clsx("flex items-center gap-[7px] md:gap-2", wrapperClassName)}
    >
      <Image
        src={logo}
        alt="Gym-Pass"
        width={32}
        height={18}
        className={clsx(
          "h-[18px] w-[32px] object-contain md:h-[18px] md:w-[32px]",
          imageClassName,
        )}
        priority
      />
      <span
        className={clsx(
          "text-[20px] leading-[1.5] text-text-logo",
          textClassName,
        )}
      >
        Gym-Pass
      </span>
    </div>
  );
}
