import clsx from "clsx";

type SectionHeadingProps = {
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ title, description, className }: SectionHeadingProps) {
  return (
    <div className={clsx("space-y-2", className)}>
      <h3 className="text-[18px] leading-[1.4] font-semibold text-text-primary md:text-[24px]">{title}</h3>
      {description ? (
        <p className="max-w-3xl text-[14px] leading-[1.5] text-text-support md:text-[16px]">{description}</p>
      ) : null}
    </div>
  );
}
