import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  CircleCheck,
  CreditCard,
  LineChart,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { PageTransition } from "@/components/shared/page-transition";
import { PageHeader } from "@/components/layout/page-header";
import { useDashboardData } from "@/features/dashboard/use-dashboard-data";
import { SpendingOverviewChart } from "@/features/dashboard/components/spending-overview-chart";
import { CategoryBreakdownChart } from "@/features/dashboard/components/category-breakdown-chart";
import { UpcomingPaymentsList } from "@/features/dashboard/components/upcoming-payments-list";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { SavingsInsights } from "@/features/dashboard/components/savings-insights";
import { useAuthStore } from "@/store/auth.store";
import { useCommandPaletteStore } from "@/store/command-palette.store";
import { formatCurrency } from "@/lib/format";

function StatCardSkeleton() {
  return <Skeleton className="h-[148px] rounded-2xl" />;
}

function ChartCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <div className="space-y-2 p-6 pb-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="px-6 pb-6">
        <Skeleton className="h-[300px] w-full" />
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const setAddSubscriptionOpen = useCommandPaletteStore(
    (s) => s.setAddSubscriptionOpen
  );
  const { isLoading, isError, data } = useDashboardData();

  const greeting = user?.name
    ? `Welcome back, ${user.name}.`
    : "Welcome back.";

  if (isError) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <PageHeader title="Dashboard" description={greeting} />
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load dashboard</AlertTitle>
            <AlertDescription>
              Something went wrong while loading your data. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description={`${greeting} Here's an overview of your subscriptions.`}
          actions={
            <Button
              onClick={() => setAddSubscriptionOpen(true)}
              className="shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30"
            >
              <Plus className="h-4 w-4" />
              Add subscription
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard
                title="Total Monthly"
                value={formatCurrency(data.monthlyTotal, data.primaryCurrency)}
                subtitle="Across active subscriptions"
                icon={CreditCard}
              />
              <StatCard
                title="Active Subscriptions"
                value={data.activeCount}
                subtitle={
                  data.activeCount === 0
                    ? "Nothing active yet"
                    : `${data.activeCount} running`
                }
                icon={CircleCheck}
              />
              <StatCard
                title="Upcoming (7 days)"
                value={data.upcomingCount}
                subtitle="Payments due soon"
                icon={CalendarClock}
                trend={{
                  value: 0,
                  direction: "neutral",
                  label: "vs last week",
                }}
              />
              <StatCard
                title="Yearly Total"
                value={formatCurrency(data.yearlyTotal, data.primaryCurrency)}
                subtitle="Projected annual spend"
                icon={TrendingUp}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {isLoading ? (
            <>
              <ChartCardSkeleton className="lg:col-span-2" />
              <ChartCardSkeleton />
            </>
          ) : (
            <>
              <Card className="lg:col-span-2">
                <div className="p-6 pb-2">
                  <h2 className="text-base font-semibold tracking-tight">
                    Spending Overview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Next 6 months projection
                  </p>
                </div>
                <div className="px-6 pb-6">
                  <SpendingOverviewChart
                    data={data.monthlyProjection}
                    currency={data.primaryCurrency}
                    className="h-[300px] w-full"
                  />
                </div>
              </Card>
              <Card>
                <div className="p-6 pb-2">
                  <h2 className="text-base font-semibold tracking-tight">
                    By Category
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Active subscriptions
                  </p>
                </div>
                <div className="px-6 pb-6">
                  {data.categoryBreakdown.length === 0 ? (
                    <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center">
                      <LineChart className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No data yet
                      </p>
                    </div>
                  ) : (
                    <CategoryBreakdownChart
                      data={data.categoryBreakdown}
                      currency={data.primaryCurrency}
                      className="h-[300px] w-full"
                    />
                  )}
                </div>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <div className="p-6 pb-2">
              <h2 className="text-base font-semibold tracking-tight">
                Upcoming Payments
              </h2>
              <p className="text-sm text-muted-foreground">Next 30 days</p>
            </div>
            <div className="px-3 pb-3">
              {isLoading ? (
                <div className="flex flex-col gap-2 p-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <UpcomingPaymentsList
                  subscriptions={data.upcomingSubscriptions}
                />
              )}
            </div>
          </Card>

          <Card>
            <div className="p-6 pb-3">
              <h2 className="text-base font-semibold tracking-tight">
                Recent Activity
              </h2>
              <p className="text-sm text-muted-foreground">Last changes</p>
            </div>
            <div className="px-6 pb-6">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <RecentActivity subscriptions={data.subscriptions} />
              )}
            </div>
          </Card>

          <Card>
            <div className="p-6 pb-3">
              <h2 className="text-base font-semibold tracking-tight">
                Savings Insights
              </h2>
              <p className="text-sm text-muted-foreground">Where money goes</p>
            </div>
            <div className="px-6 pb-6">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <SavingsInsights
                  subscriptions={data.subscriptions}
                  currency={data.primaryCurrency}
                />
              )}
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6 pb-2">
            <h2 className="text-base font-semibold tracking-tight">
              Quick Actions
            </h2>
            <p className="text-sm text-muted-foreground">
              Common things you might want to do
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 p-6 pt-2 sm:grid-cols-3">
            <Button
              onClick={() => setAddSubscriptionOpen(true)}
              className="shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30"
            >
              <Plus className="h-4 w-4" />
              Add subscription
            </Button>
            <Button variant="outline" asChild>
              <Link to="/subscriptions">
                <CreditCard className="h-4 w-4" />
                View subscriptions
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/analytics">
                <LineChart className="h-4 w-4" />
                View analytics
                <ArrowRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
