import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export function SubscriptionsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all your recurring services in one place.
          </p>
        </div>
        <Button size="lg" disabled>
          <Plus className="h-4 w-4" />
          Add subscription
        </Button>
      </header>

      <EmptyState
        icon={CreditCard}
        title="No subscriptions yet"
        description="Track Netflix, Spotify, cloud storage and more. Add your first subscription to get started."
        action={
          <Button disabled>
            <Plus className="h-4 w-4" />
            Add your first subscription
          </Button>
        }
      />
    </div>
  );
}
