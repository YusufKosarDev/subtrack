import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/10 bg-card/40 shadow-2xl shadow-black/40 backdrop-blur-xl",
        "dark:border-white/5 dark:bg-card/30",
        className
      )}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";
