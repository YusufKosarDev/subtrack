import { useMemo } from "react";
import { CalendarClock, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/shared/stat-card";
import {
  useSubscriptions,
  useUpcomingPayments,
} from "@/features/subscriptions/queries";
import { formatCurrency } from "@/lib/format";
import type { Subscription } from "@/types/subscription";

const MONTHLY_MULTIPLIERS: Record<Subscription["billingCycle"], number> = {
  WEEKLY: 4.33,
  MONTHLY: 1,
  QUARTERLY: 1 / 3,
  YEARLY: 1 / 12,
  CUSTOM: 0,
};

function mostCommonCurrency(subs: Subscription[]): string {
  if (subs.length === 0) return "TRY";
  const counts: Record<string, number> = {};
  for (const sub of subs) {
    counts[sub.currency] = (counts[sub.currency] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function StatCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="h-7 w-24" />
      <Skeleton className="mt-2 h-3 w-32" />
    </Card>
  );
}

export function DashboardPage() {
  const subscriptionsQuery = useSubscriptions();
  const upcomingQuery = useUpcomingPayments(7);

  const subscriptions = subscriptionsQuery.data?.subscriptions ?? [];
  const upcomingCount = upcomingQuery.data?.count ?? 0;

  const { totalMonthly, totalYearly, activeCount, currency } = useMemo(() => {
    const active = subscriptions.filter((s) => s.isActive);
    const monthly = active.reduce((sum, sub) => {
      const price = parseFloat(sub.price);
      if (!Number.isFinite(price)) return sum;
      return sum + price * MONTHLY_MULTIPLIERS[sub.billingCycle];
    }, 0);
    return {
      totalMonthly: monthly,
      totalYearly: monthly * 12,
      activeCount: active.length,
      currency: mostCommonCurrency(active),
    };
  }, [subscriptions]);

  const isLoading = subscriptionsQuery.isLoading;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Here&apos;s an overview of your subscriptions.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Monthly"
              value={formatCurrency(totalMonthly, currency)}
              subtitle="Equivalent across all active"
              icon={DollarSign}
            />
            <StatCard
              title="Active Subscriptions"
              value={activeCount}
              subtitle={
                activeCount === 0
                  ? "No active subscriptions"
                  : `${activeCount} active`
              }
              icon={CreditCard}
            />
            <StatCard
              title="Upcoming (7 days)"
              value={upcomingCount}
              subtitle="Payments due soon"
              icon={CalendarClock}
            />
            <StatCard
              title="Yearly Total"
              value={formatCurrency(totalYearly, currency)}
              subtitle="Projected annual spend"
              icon={TrendingUp}
            />
          </>
        )}
      </div>
    </div>
  );
}
