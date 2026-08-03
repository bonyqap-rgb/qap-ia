import { cn } from "@/lib/utils";

export interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed";
}

/** Separador visual fino e discreto para organizar conteúdos e superfícies. */
export function Divider({
  className,
  orientation = "horizontal",
  variant = "solid",
}: DividerProps) {
  return (
    <div
      role="none"
      className={cn(
        "bg-border-soft shrink-0",
        variant === "dashed" && "bg-transparent border-border border-dashed",
        orientation === "horizontal"
          ? cn("h-[1px] w-full", variant === "dashed" && "border-t-[1px]")
          : cn("w-[1px] h-full", variant === "dashed" && "border-l-[1px]"),
        className,
      )}
    />
  );
}
