import { Input } from "@/components/ui";
import { SearchIcon } from "@/components/icons";

type PermissionSearchFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function PermissionSearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: PermissionSearchFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-subtle">
        {label}
      </span>
      <div className="relative mt-3">
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <Input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="pl-11"
        />
      </div>
    </label>
  );
}
