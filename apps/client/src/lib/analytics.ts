import { format } from "date-fns";
import type { BillingCycle, Subscription } from "@/types/subscription";

const MONTHLY_MULTIPLIERS: Record<BillingCycle, number> = {
  WEEKLY: 4.33,
  MONTHLY: 1,
  QUARTERLY: 1 / 3,
  YEARLY: 1 / 12,
  CUSTOM: 0,
};

function priceOf(sub: Subscription): number {
  const n = parseFloat(sub.price);
  return Number.isFinite(n) ? n : 0;
}

export function normalizeToMonthly(price: number, cycle: BillingCycle): number {
  return price * MONTHLY_MULTIPLIERS[cycle];
}

export function calculateMonthlyTotal(subs: Subscription[]): number {
  return subs
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + normalizeToMonthly(priceOf(s), s.billingCycle), 0);
}

export function calculateYearlyTotal(subs: Subscription[]): number {
  return calculateMonthlyTotal(subs) * 12;
}

export interface CategoryBreakdownEntry {
  category: string;
  total: number;
  count: number;
}

export function groupByCategory(subs: Subscription[]): CategoryBreakdownEntry[] {
  const map = new Map<string, CategoryBreakdownEntry>();
  for (const sub of subs) {
    if (!sub.isActive) continue;
    const key = sub.category ?? "Uncategorized";
    const monthly = normalizeToMonthly(priceOf(sub), sub.billingCycle);
    const existing = map.get(key);
    if (existing) {
      existing.total += monthly;
      existing.count += 1;
    } else {
      map.set(key, { category: key, total: monthly, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export interface CycleBreakdownEntry {
  cycle: BillingCycle;
  total: number;
  count: number;
}

export function groupByCycle(subs: Subscription[]): CycleBreakdownEntry[] {
  const map = new Map<BillingCycle, CycleBreakdownEntry>();
  for (const sub of subs) {
    if (!sub.isActive) continue;
    const existing = map.get(sub.billingCycle);
    const price = priceOf(sub);
    if (existing) {
      existing.total += price;
      existing.count += 1;
    } else {
      map.set(sub.billingCycle, {
        cycle: sub.billingCycle,
        total: price,
        count: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export interface MonthlyProjectionEntry {
  month: string;
  total: number;
}

export function getUpcomingByMonth(
  subs: Subscription[],
  months = 6
): MonthlyProjectionEntry[] {
  const monthlyTotal = calculateMonthlyTotal(subs);
  const now = new Date();
  const result: MonthlyProjectionEntry[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    result.push({
      month: format(d, "MMM yyyy"),
      total: monthlyTotal,
    });
  }
  return result;
}

export interface MostExpensiveSubscription {
  subscription: Subscription | null;
  monthlyEquivalent: number;
}

export function findMostExpensive(
  subs: Subscription[]
): MostExpensiveSubscription {
  return subs
    .filter((s) => s.isActive)
    .reduce<MostExpensiveSubscription>(
      (max, sub) => {
        const monthly = normalizeToMonthly(priceOf(sub), sub.billingCycle);
        return monthly > max.monthlyEquivalent
          ? { subscription: sub, monthlyEquivalent: monthly }
          : max;
      },
      { subscription: null, monthlyEquivalent: 0 }
    );
}

export function mostCommonCurrency(subs: Subscription[]): string {
  if (subs.length === 0) return "TRY";
  const counts: Record<string, number> = {};
  for (const sub of subs) {
    counts[sub.currency] = (counts[sub.currency] ?? 0) + 1;
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? "TRY";
}
