import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean;
  loading?: boolean;
}

/**
 * Campo de Entrada (Input) premium do Design System.
 * Suporta estados: Default, Hover, Focus, Disabled, Loading, Error.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, loading, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          disabled={disabled || loading}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base md:text-sm shadow-sm transition-colors placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            error ? "border-destructive focus-visible:ring-destructive/30" : "hover:border-border",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            className,
          )}
          ref={ref}
          {...props}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
