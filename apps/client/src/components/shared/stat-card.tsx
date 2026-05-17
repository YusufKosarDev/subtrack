import type { LucideIcon } from "lucide-react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StatCardTrend {
  value: number;
  direction: "up" | "down" | "neutral";
  label: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: StatCardTrend;
  className?: string;
}

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
} as const;

const TREND_COLOR = {
  up: "text-emerald-500",
  down: "text-red-500",
  neutral: "text-muted-foreground",
} as const;

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={cn(
          "shimmer-on-hover group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card to-card/60 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-glow-primary",
          className
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/15 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        />

        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>

        <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>

        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}

        {trend && TrendIcon && (
          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md bg-card/60 px-1.5 py-0.5 text-xs font-medium tabular-nums",
                TREND_COLOR[trend.direction]
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {trend.value}
              {trend.direction !== "neutral" ? "%" : ""}
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
