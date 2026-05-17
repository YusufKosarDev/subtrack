import { useMemo } from "react";
import {
  AlertCircle,
  Banknote,
  CreditCard,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SpendingOverviewChart } from "@/features/dashboard/components/spending-overview-chart";
import { CategoryBreakdownChart } from "@/features/dashboard/components/category-breakdown-chart";
import { useDashboardData } from "@/features/dashboard/use-dashboard-data";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const cycleLabel: Record<string, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
  CUSTOM: "Custom",
};

const cycleChartConfig = {
  count: {
    label: "Subscriptions",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function AnalyticsPage() {
  const { isLoading, isError, data } = useDashboardData();

  const cycleData = useMemo(
    () =>
      data.cycleBreakdown.map((entry) => ({
        cycle: cycleLabel[entry.cycle] ?? entry.cycle,
        count: entry.count,
      })),
    [data.cycleBreakdown]
  );

  if (isError) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Insights into your subscriptions.
          </p>
        </header>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load analytics</AlertTitle>
          <AlertDescription>
            Something went wrong while loading your data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Insights into your subscriptions.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (data.activeCount === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Insights into your subscriptions.
          </p>
        </header>
        <EmptyState
          icon={Sparkles}
          title="No data to analyze yet"
          description="Add a few active subscriptions to see spending insights, category breakdowns and trends."
        />
      </div>
    );
  }

  const averageMonthly =
    data.activeCount > 0 ? data.monthlyTotal / data.activeCount : 0;
  const mostExpensiveLabel = data.mostExpensive.subscription
    ? data.mostExpensive.subscription.name
    : "—";
  const mostExpensiveValue = formatCurrency(
    data.mostExpensive.monthlyEquivalent,
    data.mostExpensive.subscription?.currency ?? data.primaryCurrency
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Insights into your subscriptions.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Annual Spend"
          value={formatCurrency(data.yearlyTotal, data.primaryCurrency)}
          subtitle="Projected over 12 months"
          icon={Banknote}
        />
        <StatCard
          title="Average Cost"
          value={formatCurrency(averageMonthly, data.primaryCurrency)}
          subtitle="Per subscription, monthly"
          icon={CreditCard}
        />
        <StatCard
          title="Most Expensive"
          value={mostExpensiveValue}
          subtitle={mostExpensiveLabel}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="p-6 pb-2">
            <h2 className="text-base font-semibold tracking-tight">
              Spending by Category
            </h2>
            <p className="text-sm text-muted-foreground">
              Monthly equivalent split across categories
            </p>
          </div>
          <div className="px-6 pb-6">
            <CategoryBreakdownChart
              data={data.categoryBreakdown}
              currency={data.primaryCurrency}
              className="h-[400px] w-full"
              maxCategories={8}
            />
          </div>
        </Card>

        <Card>
          <div className="p-6 pb-2">
            <h2 className="text-base font-semibold tracking-tight">
              Billing Cycle Distribution
            </h2>
            <p className="text-sm text-muted-foreground">
              How many subscriptions use each cycle
            </p>
          </div>
          <div className="px-6 pb-6">
            <ChartContainer
              config={cycleChartConfig}
              className="h-[400px] w-full"
            >
              <BarChart
                data={cycleData}
                margin={{ top: 16, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border opacity-30"
                />
                <XAxis
                  dataKey="cycle"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  width={36}
                />
                <ChartTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--chart-2)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={64}
                >
                  <LabelList
                    dataKey="count"
                    position="top"
                    className="fill-foreground tabular-nums"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 pb-2">
          <h2 className="text-base font-semibold tracking-tight">
            Monthly Projection
          </h2>
          <p className="text-sm text-muted-foreground">
            Next 12 months ({formatCurrencyCompact(data.monthlyTotal, data.primaryCurrency)} / month)
          </p>
        </div>
        <div className="px-6 pb-6">
          <SpendingOverviewChart
            data={data.yearlyProjection}
            currency={data.primaryCurrency}
            className="h-[400px] w-full"
          />
        </div>
      </Card>
    </div>
  );
}
