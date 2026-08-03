import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

/** Avatar corporativo premium do Design System. */
export function Avatar({ src, alt, fallback, size = "default", className }: AvatarProps) {
  const sizeClasses = {
    sm: "size-8 text-[11px]",
    default: "size-10 text-xs",
    lg: "size-12 text-sm",
  };

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted font-semibold tracking-tight text-muted-foreground select-none items-center justify-center",
        sizeClasses[size],
        className,
      )}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center uppercase font-bold">
        {fallback?.slice(0, 2) ?? ""}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
