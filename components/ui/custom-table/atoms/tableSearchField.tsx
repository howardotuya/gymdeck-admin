import type { KeyboardEventHandler } from "react";
import { SearchIcon } from "@/components/icons";

type TableSearchFieldProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onEnter?: KeyboardEventHandler<HTMLInputElement>;
};

export function TableSearchField({
  value,
  placeholder,
  onChange,
  onEnter,
}: TableSearchFieldProps) {
  return (
    <label className="flex h-[51px] flex-1 items-center gap-3 rounded-full bg-bg-muted px-5">
      <span className="sr-only">{placeholder}</span>
      <SearchIcon size={18} className="text-text-support" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onEnter}
        className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none"
      />
    </label>
  );
}
