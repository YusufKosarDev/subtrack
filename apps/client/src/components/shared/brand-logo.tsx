import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "md" | "lg";

const sizeMap: Record<
  BrandLogoSize,
  { square: string; text: string; radius: string }
> = {
  sm: { square: "h-7 w-7 text-xs", text: "text-base", radius: "rounded-lg" },
  md: { square: "h-9 w-9 text-sm", text: "text-lg", radius: "rounded-xl" },
  lg: { square: "h-12 w-12 text-lg", text: "text-2xl", radius: "rounded-2xl" },
};

interface BrandLogoProps {
  size?: BrandLogoSize;
  className?: string;
  showWordmark?: boolean;
}

export function BrandLogo({
  size = "md",
  className,
  showWordmark = true,
}: BrandLogoProps) {
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        "group inline-flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.03]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/60 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/30",
          s.square,
          s.radius
        )}
      >
        S
      </div>
      {showWordmark && (
        <span className={cn("font-semibold tracking-tight", s.text)}>
          SubTrack
        </span>
      )}
    </div>
  );
}
