import type { KeyboardEventHandler } from "react";
import { SearchIcon } from "@/components/icons";
import { Input } from "@/components/ui";

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
    <label className="flex h-[51px] flex-1 items-center gap-3 rounded-full border border-border-soft bg-bg-surface px-5 transition-[border-color,box-shadow] focus-within:border-border-strong focus-within:ring-2 focus-within:ring-text-brand/20">
      <span className="sr-only">{placeholder}</span>
      <SearchIcon size={18} className="text-text-secondary" />
      <Input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onEnter}
        className="w-full border-0 bg-transparent px-0 shadow-none ring-0 focus-visible:ring-0"
      />
    </label>
  );
}
