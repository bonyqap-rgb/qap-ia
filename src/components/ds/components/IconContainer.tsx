import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IconContainerProps {
  icon: ComponentType<{ className?: string }>;
  tone?: "neutral" | "primary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: ReactNode;
}

/** Contêiner padronizado para ícones com suporte a tons de status e tamanhos consistentes. */
export function IconContainer({
  icon: Icon,
  tone = "neutral",
  size = "default",
  className,
}: IconContainerProps) {
  const toneClasses = {
    neutral: "border-border bg-background-secondary text-text-secondary",
    primary: "border-primary/20 bg-primary-soft text-primary",
    success: "border-success/20 bg-success/10 text-success",
    warning: "border-warning/20 bg-warning/10 text-warning",
    error: "border-error/20 bg-error/10 text-error",
    info: "border-info/20 bg-info/10 text-info",
  };

  const sizeClasses = {
    sm: "size-8 rounded-sm [&_svg]:size-3.5",
    default: "size-10 rounded-sm [&_svg]:size-4",
    lg: "size-12 rounded-md [&_svg]:size-5",
  };

  return (
    <span
      className={cn(
        "grid place-items-center border shrink-0",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      aria-hidden
    >
      <Icon />
    </span>
  );
}
