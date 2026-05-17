import { motion } from "framer-motion";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { normalizeToMonthly } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";

function priceOf(sub: Subscription): number {
  const n = parseFloat(sub.price);
  return Number.isFinite(n) ? n : 0;
}

interface HealthScoreProps {
  subscriptions: Subscription[];
}

function computeHealthScore(active: Subscription[]): number {
  if (active.length === 0) return 0;
  let score = 60;
  const categories = new Set(active.map((s) => s.category ?? "Uncategorized"));
  score += Math.min(categories.size * 4, 20);
  if (active.length >= 3) score += 8;
  if (active.length >= 6) score += 4;
  const monthly = active.map((s) =>
    normalizeToMonthly(priceOf(s), s.billingCycle)
  );
  const total = monthly.reduce((a, b) => a + b, 0);
  if (total > 0) {
    const max = Math.max(...monthly);
    if (max / total > 0.5) score -= 15;
    if (max / total > 0.75) score -= 10;
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getMood(score: number): { emoji: string; label: string; color: string } {
  if (score >= 80) return { emoji: "🙂", label: "Healthy", color: "text-emerald-500" };
  if (score >= 60) return { emoji: "😐", label: "Okay", color: "text-amber-500" };
  return { emoji: "🫠", label: "Needs attention", color: "text-red-500" };
}

export function HealthScore({ subscriptions }: HealthScoreProps) {
  const active = subscriptions.filter((s) => s.isActive);
  const score = computeHealthScore(active);
  const mood = getMood(score);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Subscription health
          </h3>
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="How is this calculated?"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Combines diversity of categories, total active count, and how
                concentrated your spending is on a single subscription.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="fill-none stroke-border/40"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              className="fill-none stroke-primary"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">{score}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              / 100
            </span>
          </div>
        </div>

        <div>
          <p className="text-2xl" aria-hidden="true">
            {mood.emoji}
          </p>
          <p className={cn("text-sm font-semibold", mood.color)}>
            {mood.label}
          </p>
          <p className="text-xs text-muted-foreground">
            Based on {active.length} active subscription
            {active.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </div>
  );
}
