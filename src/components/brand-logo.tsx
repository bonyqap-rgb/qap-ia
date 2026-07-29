import logoAsset from "@/assets/qap-ia-logo.png.asset.json";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  /** Tamanho do emblema em px */
  size?: number;
};

/** Emblema oficial do QAP IA. */
export function BrandLogo({ className, size = 36 }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-navy-dark ring-1 ring-inset ring-azure/25",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <img
        src={logoAsset.url}
        alt="QAP IA"
        width={size}
        height={size}
        className="h-full w-full scale-[1.7] object-cover object-[50%_16%]"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

export function BrandWordmark({
  className,
  size = 36,
  tagline = "Inteligência que apoia quem protege",
}: BrandLogoProps & { tagline?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <BrandLogo size={size} />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-display text-sm font-bold tracking-tight text-foreground">
          QAP <span className="text-azure">IA</span>
        </span>
        <span className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {tagline}
        </span>
      </span>
    </span>
  );
}
