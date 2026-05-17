import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trends and insights into your subscription spending.
        </p>
      </header>

      <EmptyState
        icon={Sparkles}
        title="Coming soon"
        description="Spending charts, category breakdowns and renewal forecasts are on the way."
      />
    </div>
  );
}
