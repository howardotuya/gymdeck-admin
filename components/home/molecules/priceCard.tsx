import clsx from "clsx";

type PriceCardProps = {
  price: string;
  suffix: string;
  buttonLabel?: string;
  className?: string;
};

export function PriceCard({
  buttonLabel = "See Pricing",
  className,
  price,
  suffix,
}: PriceCardProps) {
  return (
    <div className={clsx("rounded-[20px] bg-bg-muted p-5", className)}>
      <p className="text-[24px] leading-[1.4] font-semibold text-text-primary">
        {price}
        <span className="ml-1 text-[14px] leading-[1.4] font-normal text-text-support">{suffix}</span>
      </p>
      <button
        type="button"
        className="mt-5 inline-flex h-[49px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] font-medium leading-[1.4] text-text-inverse transition-colors hover:bg-brand-primary-hover"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
