import { ArrowRight, CalendarClock, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency, formatRelativeDate, getDaysUntil } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";

interface UpcomingPaymentsListProps {
  subscriptions: Subscription[];
  maxItems?: number;
}

function dueClass(days: number): string {
  if (days <= 3) return "text-destructive";
  if (days <= 7) return "text-orange-500";
  return "text-muted-foreground";
}

export function UpcomingPaymentsList({
  subscriptions,
  maxItems = 5,
}: UpcomingPaymentsListProps) {
  const items = subscriptions.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-card/20 px-4 py-10 text-center">
        <CalendarClock className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No upcoming payments</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {items.map((sub) => {
        const days = getDaysUntil(sub.nextPaymentDate);
        return (
          <div
            key={sub.id}
            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/30"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{sub.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {sub.category ?? "Uncategorized"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium tabular-nums">
                {formatCurrency(sub.price, sub.currency)}
              </p>
              <p className={cn("text-xs", dueClass(days))}>
                {formatRelativeDate(sub.nextPaymentDate)}
              </p>
            </div>
          </div>
        );
      })}
      <Link
        to="/subscriptions"
        className="mt-2 inline-flex items-center justify-end gap-1 px-3 py-1 text-xs font-medium text-primary hover:underline"
      >
        View all
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
