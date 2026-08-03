import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFieldProps {
  placeholder?: string;
  className?: string;
  shortcut?: string | null;
  "aria-label"?: string;
  disabled?: boolean;
}

/** Campo de pesquisa visual do Design System, extremamente limpo e polido. */
export function SearchField({
  placeholder = "Pesquisar…",
  className,
  shortcut = "⌘K",
  "aria-label": ariaLabel = "Pesquisa global",
  disabled,
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        "group relative flex h-9 items-center rounded-xl border border-border/70 bg-muted/40 transition-colors duration-200 focus-within:border-azure/50 focus-within:bg-card hover:border-border",
        disabled ? "opacity-50 pointer-events-none" : "",
        className,
      )}
    >
      <Search
        className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
        aria-hidden
      />
      <input
        type="search"
        disabled={disabled}
        aria-label={ariaLabel}
        placeholder={placeholder}
        className="h-full w-full min-w-0 rounded-xl bg-transparent pl-9 pr-14 text-footnote text-foreground outline-none placeholder:text-muted-foreground"
      />
      {shortcut && (
        <kbd className="pointer-events-none absolute right-2 hidden select-none rounded-md border border-border/70 bg-card px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:block">
          {shortcut}
        </kbd>
      )}
    </div>
  );
}
