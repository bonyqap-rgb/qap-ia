import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

/**
 * Campo de Texto Expandido (Textarea) premium do Design System.
 * Suporta estados: Default, Hover, Focus, Disabled, Error.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <textarea
        disabled={disabled}
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          error ? "border-destructive focus-visible:ring-destructive/30" : "hover:border-border",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
