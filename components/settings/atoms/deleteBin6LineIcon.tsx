import type { SVGProps } from "react"

type DeleteBin6LineIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
  title?: string
}

export function DeleteBin6LineIcon({
  color = "currentColor",
  height,
  size = 20,
  title,
  width,
  ...props
}: DeleteBin6LineIconProps) {
  const isDecorative = !title && props["aria-label"] == null && props["aria-labelledby"] == null

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 20 20"
      fill="none"
      color={color}
      role={isDecorative ? undefined : "img"}
      aria-hidden={isDecorative ? true : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M6.25 4V2.5H13.75V4H17.5V5.5H16V16.75C16 16.9489 15.921 17.1397 15.7803 17.2803C15.6397 17.421 15.4489 17.5 15.25 17.5H4.75C4.55109 17.5 4.36032 17.421 4.21967 17.2803C4.07902 17.1397 4 16.9489 4 16.75V5.5H2.5V4H6.25ZM5.5 5.5V16H14.5V5.5H5.5ZM7.75 7.75H9.25V13.75H7.75V7.75ZM10.75 7.75H12.25V13.75H10.75V7.75Z"
        fill="currentColor"
      />
    </svg>
  )
}
