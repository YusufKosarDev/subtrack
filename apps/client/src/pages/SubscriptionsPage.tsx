import { useMemo, useState } from "react";
import { AlertCircle, CreditCard, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/shared/empty-state";
import { SubscriptionTable } from "@/features/subscriptions/components/subscription-table";
import { SubscriptionTableSkeleton } from "@/features/subscriptions/components/subscription-table-skeleton";
import {
  SubscriptionFilters,
  type CycleFilter,
  type StatusFilter,
} from "@/features/subscriptions/components/subscription-filters";
import { DeleteSubscriptionDialog } from "@/features/subscriptions/components/delete-subscription-dialog";
import {
  useDeleteSubscription,
  useSubscriptions,
} from "@/features/subscriptions/queries";
import type { Subscription } from "@/types/subscription";

export function SubscriptionsPage() {
  const subscriptionsQuery = useSubscriptions();
  const deleteMutation = useDeleteSubscription();

  const [searchQuery, setSearchQuery] = useState("");
  const [cycleFilter, setCycleFilter] = useState<CycleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [toDelete, setToDelete] = useState<Subscription | null>(null);

  const subscriptions = subscriptionsQuery.data?.subscriptions ?? [];

  const hasFilters =
    !!searchQuery || cycleFilter !== "all" || statusFilter !== "all";

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return subscriptions.filter((sub) => {
      const matchesSearch =
        !query ||
        sub.name.toLowerCase().includes(query) ||
        (sub.category?.toLowerCase().includes(query) ?? false);
      const matchesCycle =
        cycleFilter === "all" || sub.billingCycle === cycleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? sub.isActive : !sub.isActive);
      return matchesSearch && matchesCycle && matchesStatus;
    });
  }, [subscriptions, searchQuery, cycleFilter, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setCycleFilter("all");
    setStatusFilter("all");
  };

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteMutation.mutate(toDelete.id, {
      onSuccess: () => setToDelete(null),
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your recurring expenses in one place.
          </p>
        </div>
        <Button size="lg" disabled>
          <Plus className="h-4 w-4" />
          Add subscription
        </Button>
      </header>

      <SubscriptionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cycleFilter={cycleFilter}
        onCycleChange={setCycleFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onClear={clearFilters}
      />

      {subscriptionsQuery.isLoading ? (
        <SubscriptionTableSkeleton />
      ) : subscriptionsQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load subscriptions</AlertTitle>
          <AlertDescription>
            Something went wrong while fetching your subscriptions. Please try
            again.
          </AlertDescription>
        </Alert>
      ) : subscriptions.length === 0 ? (
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
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No results match your filters"
          description="Try changing or clearing your filters to see more subscriptions."
          action={
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <SubscriptionTable
          subscriptions={filtered}
          onEdit={() => toast.info("Editing comes in the next sprint")}
          onToggle={() => toast.info("Toggling comes in the next sprint")}
          onDelete={setToDelete}
        />
      )}

      <DeleteSubscriptionDialog
        subscription={toDelete}
        isPending={deleteMutation.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
