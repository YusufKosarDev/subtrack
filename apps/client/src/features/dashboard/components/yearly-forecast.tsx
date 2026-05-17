import { formatCurrency } from "@/lib/format";

interface YearlyForecastProps {
  monthlyTotal: number;
  currency: string;
}

export function YearlyForecast({ monthlyTotal, currency }: YearlyForecastProps) {
  const now = new Date();
  const monthsElapsed = now.getMonth() + 1;
  const yearToDate = monthlyTotal * monthsElapsed;
  const projected = monthlyTotal * 12;
  const remaining = projected - yearToDate;
  const progress = projected > 0 ? Math.min(1, yearToDate / projected) : 0;
  const monthLabel = now.toLocaleString("en-US", { month: "short" });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Yearly forecast
        </h3>
        <span className="text-xs text-muted-foreground">
          Through {monthLabel}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Year to date</p>
            <p className="text-xl font-bold tabular-nums">
              {formatCurrency(yearToDate, currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Projected total</p>
            <p className="text-xl font-bold tabular-nums">
              {formatCurrency(projected, currency)}
            </p>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground tabular-nums">
            {formatCurrency(remaining, currency)}
          </span>{" "}
          remaining at the current pace.
        </p>
      </div>
    </div>
  );
}
