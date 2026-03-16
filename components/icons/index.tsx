import type { ReactNode, SVGProps } from "react";
import { useId } from "react";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number | string;
  title?: string;
};

type SvgIconProps = IconProps & {
  children: ReactNode;
  defaultColor: string;
  defaultSize: number;
  viewBox: string;
};

function SvgIcon({
  children,
  color,
  defaultColor,
  defaultSize,
  height,
  size = defaultSize,
  title,
  viewBox,
  width,
  ...props
}: SvgIconProps) {
  const isDecorative =
    !title && props["aria-label"] == null && props["aria-labelledby"] == null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? size}
      height={height ?? size}
      viewBox={viewBox}
      fill="none"
      color={color ?? defaultColor}
      role={isDecorative ? undefined : "img"}
      aria-hidden={isDecorative ? true : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function ArrowDownSLineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-support)" defaultSize={24} viewBox="0 0 24 24">
      <path
        d="M12 10.9454L7.545 15.4004L6.2724 14.1278L12 8.40019L17.7276 14.1278L16.455 15.4004L12 10.9454Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function ArrowRightSLineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-support)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M10.7958 9.99956L7.08331 6.28706L8.14381 5.22656L12.9168 9.99956L8.14381 14.7726L7.08331 13.7121L10.7958 9.99956Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function ArrowLeftSLineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-inverse)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M10.7956 10.0004L7.08313 6.28794L8.14363 5.22744L12.9166 10.0004L8.14363 14.7734L7.08313 13.7129L10.7956 10.0004Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function CheckIcon(props: IconProps) {
  const maskId = useId();

  return (
    <SvgIcon {...props} defaultColor="var(--text-accent-soft)" defaultSize={20} viewBox="0 0 20 20">
      <mask
        id={maskId}
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="20"
        height="20"
      >
        <rect width="20" height="20" fill="white" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path
          d="M7.95834 14.9993L3.20834 10.2493L4.39584 9.06185L7.95834 12.6243L15.6042 4.97852L16.7917 6.16602L7.95834 14.9993Z"
          fill="currentColor"
        />
      </g>
    </SvgIcon>
  );
}

export function HeartLineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-brand)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M10.0008 4.39673C11.7625 2.81498 14.485 2.86748 16.1823 4.56774C17.8788 6.26874 17.9373 8.97774 16.3593 10.7447L9.99925 17.1137L3.64075 10.7447C2.06275 8.97774 2.122 6.26424 3.81775 4.56774C5.5165 2.86973 8.23375 2.81273 10.0008 4.39673V4.39673ZM15.1203 5.62749C13.9953 4.50099 12.1803 4.45524 11.0028 5.51274L10.0015 6.41124L8.9995 5.51349C7.81825 4.45449 6.007 4.50099 4.879 5.62899C3.7615 6.74649 3.70525 8.53524 4.735 9.71724L10 14.9905L15.265 9.71799C16.2955 8.53524 16.2393 6.74874 15.1203 5.62749V5.62749Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function Map2LineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-support)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M2.5 4.75L7.75 2.5L12.25 4.75L16.9772 2.72425C17.0343 2.69979 17.0966 2.68988 17.1584 2.69541C17.2202 2.70094 17.2797 2.72173 17.3316 2.75593C17.3834 2.79013 17.4259 2.83666 17.4553 2.89135C17.4847 2.94603 17.5001 3.00716 17.5 3.06925V15.25L12.25 17.5L7.75 15.25L3.02275 17.2758C2.96569 17.3002 2.90344 17.3101 2.8416 17.3046C2.77976 17.2991 2.72026 17.2783 2.66844 17.2441C2.61662 17.2099 2.5741 17.1633 2.54471 17.1087C2.51531 17.054 2.49994 16.9928 2.5 16.9307V4.75ZM13 15.5463L16 14.2607V4.77475L13 6.06025V15.5463ZM11.5 15.448V6.052L8.5 4.552V13.948L11.5 15.448ZM7 13.9398V4.45375L4 5.73925V15.2252L7 13.9398Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function MapPin2LineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-brand)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M10 18.7959L5.227 14.0229C4.28301 13.0789 3.64014 11.8762 3.3797 10.5668C3.11925 9.25746 3.25293 7.90026 3.76382 6.66687C4.27472 5.43347 5.13988 4.37927 6.24991 3.63757C7.35994 2.89588 8.66498 2.5 10 2.5C11.335 2.5 12.6401 2.89588 13.7501 3.63757C14.8601 4.37927 15.7253 5.43347 16.2362 6.66687C16.7471 7.90026 16.8808 9.25746 16.6203 10.5668C16.3599 11.8762 15.717 13.0789 14.773 14.0229L10 18.7959ZM13.7125 12.9624C14.4467 12.2282 14.9466 11.2927 15.1492 10.2743C15.3517 9.25596 15.2477 8.20039 14.8503 7.24111C14.4529 6.28183 13.78 5.46192 12.9167 4.88507C12.0533 4.30821 11.0383 4.00032 10 4.00032C8.96167 4.00032 7.94666 4.30821 7.08332 4.88507C6.21997 5.46192 5.54706 6.28183 5.14969 7.24111C4.75231 8.20039 4.64831 9.25596 4.85084 10.2743C5.05337 11.2927 5.55333 12.2282 6.2875 12.9624L10 16.6749L13.7125 12.9624V12.9624ZM10 10.7499C9.60218 10.7499 9.22065 10.5919 8.93934 10.3106C8.65804 10.0293 8.5 9.64777 8.5 9.24994C8.5 8.85212 8.65804 8.47059 8.93934 8.18928C9.22065 7.90798 9.60218 7.74994 10 7.74994C10.3978 7.74994 10.7794 7.90798 11.0607 8.18928C11.342 8.47059 11.5 8.85212 11.5 9.24994C11.5 9.64777 11.342 10.0293 11.0607 10.3106C10.7794 10.5919 10.3978 10.7499 10 10.7499Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function MapPinFillIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-brand)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M10 18.7959L5.227 14.0229C4.28301 13.0789 3.64014 11.8762 3.3797 10.5668C3.11925 9.25746 3.25293 7.90026 3.76382 6.66687C4.27472 5.43347 5.13988 4.37927 6.24991 3.63757C7.35994 2.89588 8.66498 2.5 10 2.5C11.335 2.5 12.6401 2.89588 13.7501 3.63757C14.8601 4.37927 15.7253 5.43347 16.2362 6.66687C16.7471 7.90026 16.8808 9.25746 16.6203 10.5668C16.3599 11.8762 15.717 13.0789 14.773 14.0229L10 18.7959ZM10 10.75C10.9283 10.75 11.75 9.92825 11.75 8.99999C11.75 8.07174 10.9283 7.25 10 7.25C9.07172 7.25 8.25 8.07174 8.25 8.99999C8.25 9.92825 9.07172 10.75 10 10.75Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function Notification3LineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-brand)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M16 13.75H17.5V15.25H2.5V13.75H4V8.5C4 6.9087 4.63214 5.38258 5.75736 4.25736C6.88258 3.13214 8.4087 2.5 10 2.5C11.5913 2.5 13.1174 3.13214 14.2426 4.25736C15.3679 5.38258 16 6.9087 16 8.5V13.75ZM14.5 13.75V8.5C14.5 7.30653 14.0259 6.16193 13.182 5.31802C12.3381 4.47411 11.1935 4 10 4C8.80653 4 7.66193 4.47411 6.81802 5.31802C5.97411 6.16193 5.5 7.30653 5.5 8.5V13.75H14.5ZM7.75 16.75H12.25V18.25H7.75V16.75Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function InformationLineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-brand)" defaultSize={24} viewBox="0 0 24 24">
      <path
        d="M12 21C7.0293 21 3 16.9707 3 12C3 7.0293 7.0293 3 12 3C16.9707 3 21 7.0293 21 12C21 16.9707 16.9707 21 12 21ZM12 19.2C13.9096 19.2 15.7409 18.4414 17.0912 17.0912C18.4414 15.7409 19.2 13.9096 19.2 12C19.2 10.0904 18.4414 8.25909 17.0912 6.90883C15.7409 5.55857 13.9096 4.8 12 4.8C10.0904 4.8 8.25909 5.55857 6.90883 6.90883C5.55857 8.25909 4.8 10.0904 4.8 12C4.8 13.9096 5.55857 15.7409 6.90883 17.0912C8.25909 18.4414 10.0904 19.2 12 19.2V19.2ZM11.1 7.5H12.9V9.3H11.1V7.5ZM11.1 11.1H12.9V16.5H11.1V11.1Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function Search2LineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-support)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M9.25 2.5C12.976 2.5 16 5.524 16 9.25C16 12.976 12.976 16 9.25 16C5.524 16 2.5 12.976 2.5 9.25C2.5 5.524 5.524 2.5 9.25 2.5ZM9.25 14.5C12.1502 14.5 14.5 12.1502 14.5 9.25C14.5 6.349 12.1502 4 9.25 4C6.349 4 4 6.349 4 9.25C4 12.1502 6.349 14.5 9.25 14.5ZM15.6137 14.5532L17.7355 16.6742L16.6742 17.7355L14.5532 15.6137L15.6137 14.5532V14.5532Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function ShareBoxFillIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-brand)" defaultSize={24} viewBox="0 0 24 24">
      <path
        d="M10.2 3.90039V5.70039H5.70002V18.3004H18.3V13.8004H20.1V19.2004C20.1 19.4391 20.0052 19.668 19.8364 19.8368C19.6676 20.0056 19.4387 20.1004 19.2 20.1004H4.80002C4.56133 20.1004 4.33241 20.0056 4.16363 19.8368C3.99485 19.668 3.90002 19.4391 3.90002 19.2004V4.80039C3.90002 4.5617 3.99485 4.33278 4.16363 4.16399C4.33241 3.99521 4.56133 3.90039 4.80002 3.90039H10.2ZM17.1363 8.13669L12 13.273L10.7274 12.0004L15.8637 6.86409L12.9 3.90039H20.1V11.1004L17.1363 8.13669Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function StarFillIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-brand)" defaultSize={16} viewBox="0 0 16 16">
      <path
        d="M8 11.7556L3.7682 14.1244L4.7132 9.36761L1.1522 6.07481L5.9684 5.50361L8 1.09961L10.0316 5.50361L14.8478 6.07481L11.2868 9.36761L12.2318 14.1244L8 11.7556Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function UserStarLineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-brand)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M10 11.5V13C8.80653 13 7.66193 13.4741 6.81802 14.318C5.97411 15.1619 5.5 16.3065 5.5 17.5H4C4 15.9087 4.63214 14.3826 5.75736 13.2574C6.88258 12.1321 8.4087 11.5 10 11.5V11.5ZM10 10.75C7.51375 10.75 5.5 8.73625 5.5 6.25C5.5 3.76375 7.51375 1.75 10 1.75C12.4863 1.75 14.5 3.76375 14.5 6.25C14.5 8.73625 12.4863 10.75 10 10.75ZM10 9.25C11.6575 9.25 13 7.9075 13 6.25C13 4.5925 11.6575 3.25 10 3.25C8.3425 3.25 7 4.5925 7 6.25C7 7.9075 8.3425 9.25 10 9.25ZM14.5 17.125L12.2957 18.2838L12.7165 15.8298L10.9337 14.0912L13.3983 13.7327L14.5 11.5L15.6025 13.7327L18.0662 14.0912L16.2835 15.8298L16.7035 18.2838L14.5 17.125Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function CloseFillIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-support)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M9.99999 8.93906L13.7125 5.22656L14.773 6.28706L11.0605 9.99956L14.773 13.7121L13.7125 14.7726L9.99999 11.0601L6.28749 14.7726L5.22699 13.7121L8.93949 9.99956L5.22699 6.28706L6.28749 5.22656L9.99999 8.93906Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function FileCopyLineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-support)" defaultSize={24} viewBox="0 0 20 20">
      <path
        d="M7.5 6.25008V2.50008C7.5 2.08587 7.83579 1.75008 8.25 1.75008H16.75C17.1642 1.75008 17.5 2.08587 17.5 2.50008V13.7501C17.5 14.1643 17.1642 14.5001 16.75 14.5001H13.5V17.5001C13.5 17.9143 13.1642 18.2501 12.75 18.2501H3.25C2.83579 18.2501 2.5 17.9143 2.5 17.5001V7.00008C2.5 6.58587 2.83579 6.25008 3.25 6.25008H7.5ZM7.5 7.75008H4V16.7501H12V14.5001H8.25C7.83579 14.5001 7.5 14.1643 7.5 13.7501V7.75008ZM9 3.25008V13.0001H16V3.25008H9Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function HistoryFillIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-brand)" defaultSize={20} viewBox="0 0 20 20">
      <path
        d="M10 2.5C14.1422 2.5 17.5 5.85775 17.5 10C17.5 14.1422 14.1422 17.5 10 17.5C5.85775 17.5 2.5 14.1422 2.5 10H4C4 13.3135 6.6865 16 10 16C13.3135 16 16 13.3135 16 10C16 6.6865 13.3135 4 10 4C8.152 4 6.499 4.8355 5.39875 6.14875L7 7.75H2.5V3.25L4.33525 5.0845C5.71 3.502 7.738 2.5 10 2.5ZM10.75 6.25V9.68875L13.1823 12.121L12.121 13.1823L9.25 10.3098V6.25H10.75Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function Filter3LineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-emphasis)" defaultSize={16} viewBox="0 0 16 16">
      <path
        d="M6.79998 11.6004H9.19998V10.4004H6.79998V11.6004ZM2.59998 4.40039V5.60039H13.4V4.40039H2.59998ZM4.39998 8.60039H11.6V7.40039H4.39998V8.60039Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export function TimeLineIcon(props: IconProps) {
  return (
    <SvgIcon {...props} defaultColor="var(--text-emphasis)" defaultSize={18} viewBox="0 0 18 18">
      <path
        d="M9 15.75C5.27198 15.75 2.25 12.728 2.25 9C2.25 5.27198 5.27198 2.25 9 2.25C12.728 2.25 15.75 5.27198 15.75 9C15.75 12.728 12.728 15.75 9 15.75ZM9 14.4C10.4322 14.4 11.8057 13.8311 12.8184 12.8184C13.8311 11.8057 14.4 10.4322 14.4 9C14.4 7.56783 13.8311 6.19432 12.8184 5.18162C11.8057 4.16893 10.4322 3.6 9 3.6C7.56783 3.6 6.19432 4.16893 5.18162 5.18162C4.16893 6.19432 3.6 7.56783 3.6 9C3.6 10.4322 4.16893 11.8057 5.18162 12.8184C6.19432 13.8311 7.56783 14.4 9 14.4V14.4ZM9.675 9H12.375V10.35H8.325V5.625H9.675V9Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
