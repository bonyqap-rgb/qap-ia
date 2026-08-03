import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "default" | "lg" | "icon";
  loading?: boolean;
  selected?: boolean;
}

/**
 * Botão corporativo premium do Design System.
 * Suporta estados: Default, Hover, Focus, Pressed, Disabled, Loading, Selected.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      loading,
      disabled,
      selected,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const variantClasses = {
      primary:
        "bg-gradient-azure text-primary-foreground shadow-azure hover:bg-primary/95 active:bg-primary/90",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
      outline:
        "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizeClasses = {
      sm: "h-8 px-3 text-xs rounded-md",
      default: "h-9 px-4 text-sm rounded-md",
      lg: "h-11 px-8 text-base rounded-lg",
      icon: "h-9 w-9 p-0 rounded-md",
    };

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          selected && "ring-2 ring-primary",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin shrink-0" />}
        {!loading && children}
        {loading && size !== "icon" && <span className="sr-only">Carregando...</span>}
      </Comp>
    );
  },
);

Button.displayName = "Button";
