import { CalendarClock, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Here&apos;s an overview of your subscriptions.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Monthly"
          value="$0.00"
          subtitle="Across all subscriptions"
          icon={DollarSign}
        />
        <StatCard
          title="Active Subscriptions"
          value={0}
          subtitle="No subscriptions yet"
          icon={CreditCard}
        />
        <StatCard
          title="Upcoming Payments"
          value={0}
          subtitle="In the next 7 days"
          icon={CalendarClock}
        />
        <StatCard
          title="This Month"
          value="$0.00"
          subtitle="Charges so far"
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}
