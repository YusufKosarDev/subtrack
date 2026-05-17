import { Calculator, Coins, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { normalizeToMonthly } from "@/lib/analytics";
import type { Subscription } from "@/types/subscription";

interface SavingsInsightsProps {
  subscriptions: Subscription[];
  currency: string;
}

function priceOf(sub: Subscription): number {
  const n = parseFloat(sub.price);
  return Number.isFinite(n) ? n : 0;
}

interface InsightCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtext: string;
  accent: string;
}

function InsightCard({
  icon: Icon,
  label,
  value,
  subtext,
  accent,
}: InsightCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/30 bg-card/40 p-3">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg ring-1",
          accent
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-base font-bold tabular-nums">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{subtext}</p>
      </div>
    </div>
  );
}

export function SavingsInsights({
  subscriptions,
  currency,
}: SavingsInsightsProps) {
  const active = subscriptions.filter((s) => s.isActive);

  if (active.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border/40 bg-card/20 px-4 py-6 text-center text-sm text-muted-foreground">
        Add a subscription to see insights.
      </p>
    );
  }

  const enriched = active.map((sub) => ({
    sub,
    monthly: normalizeToMonthly(priceOf(sub), sub.billingCycle),
  }));

  const mostExpensive = enriched.reduce((max, cur) =>
    cur.monthly > max.monthly ? cur : max
  );
  const cheapest = enriched.reduce((min, cur) =>
    cur.monthly < min.monthly ? cur : min
  );
  const totalMonthly = enriched.reduce((sum, e) => sum + e.monthly, 0);
  const avg = totalMonthly / active.length;

  return (
    <div className="space-y-2">
      <InsightCard
        icon={Crown}
        label="Most expensive"
        value={formatCurrency(mostExpensive.monthly, mostExpensive.sub.currency)}
        subtext={mostExpensive.sub.name}
        accent="bg-amber-500/10 text-amber-500 ring-amber-500/20"
      />
      <InsightCard
        icon={Coins}
        label="Cheapest active"
        value={formatCurrency(cheapest.monthly, cheapest.sub.currency)}
        subtext={cheapest.sub.name}
        accent="bg-emerald-500/10 text-emerald-500 ring-emerald-500/20"
      />
      <InsightCard
        icon={Calculator}
        label="Average / subscription"
        value={formatCurrency(avg, currency)}
        subtext={`${active.length} active`}
        accent="bg-primary/10 text-primary ring-primary/20"
      />
    </div>
  );
}
