import { useMemo } from "react";
import {
  useSubscriptions,
  useUpcomingPayments,
} from "@/features/subscriptions/queries";
import {
  calculateMonthlyTotal,
  calculateYearlyTotal,
  findMostExpensive,
  getUpcomingByMonth,
  groupByCategory,
  groupByCycle,
  mostCommonCurrency,
  type CategoryBreakdownEntry,
  type CycleBreakdownEntry,
  type MonthlyProjectionEntry,
  type MostExpensiveSubscription,
} from "@/lib/analytics";
import type { Subscription } from "@/types/subscription";

export interface DashboardData {
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  upcomingSubscriptions: Subscription[];
  monthlyTotal: number;
  yearlyTotal: number;
  activeCount: number;
  upcomingCount: number;
  categoryBreakdown: CategoryBreakdownEntry[];
  cycleBreakdown: CycleBreakdownEntry[];
  monthlyProjection: MonthlyProjectionEntry[];
  yearlyProjection: MonthlyProjectionEntry[];
  mostExpensive: MostExpensiveSubscription;
  primaryCurrency: string;
}

interface UseDashboardDataResult {
  isLoading: boolean;
  isError: boolean;
  data: DashboardData;
}

export function useDashboardData(): UseDashboardDataResult {
  const subscriptionsQuery = useSubscriptions();
  const upcoming7Query = useUpcomingPayments(7);
  const upcoming30Query = useUpcomingPayments(30);

  const subscriptions = subscriptionsQuery.data?.subscriptions ?? [];
  const upcomingCount = upcoming7Query.data?.count ?? 0;
  const upcomingSubscriptions = upcoming30Query.data?.subscriptions ?? [];

  const data = useMemo<DashboardData>(() => {
    const active = subscriptions.filter((s) => s.isActive);
    return {
      subscriptions,
      activeSubscriptions: active,
      upcomingSubscriptions,
      monthlyTotal: calculateMonthlyTotal(subscriptions),
      yearlyTotal: calculateYearlyTotal(subscriptions),
      activeCount: active.length,
      upcomingCount,
      categoryBreakdown: groupByCategory(subscriptions),
      cycleBreakdown: groupByCycle(subscriptions),
      monthlyProjection: getUpcomingByMonth(subscriptions, 6),
      yearlyProjection: getUpcomingByMonth(subscriptions, 12),
      mostExpensive: findMostExpensive(subscriptions),
      primaryCurrency: mostCommonCurrency(active),
    };
  }, [subscriptions, upcomingSubscriptions, upcomingCount]);

  return {
    isLoading:
      subscriptionsQuery.isLoading ||
      upcoming7Query.isLoading ||
      upcoming30Query.isLoading,
    isError:
      subscriptionsQuery.isError ||
      upcoming7Query.isError ||
      upcoming30Query.isError,
    data,
  };
}
