import { useMemo, useState } from "react";
import { AlertCircle, CreditCard, Plus } from "lucide-react";
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
import { SubscriptionDialog } from "@/features/subscriptions/components/subscription-dialog";
import {
  useDeleteSubscription,
  useSubscriptions,
  useUpdateSubscription,
} from "@/features/subscriptions/queries";
import type { Subscription } from "@/types/subscription";

export function SubscriptionsPage() {
  const subscriptionsQuery = useSubscriptions();
  const deleteMutation = useDeleteSubscription();
  const updateMutation = useUpdateSubscription();

  const [searchQuery, setSearchQuery] = useState("");
  const [cycleFilter, setCycleFilter] = useState<CycleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [toDelete, setToDelete] = useState<Subscription | null>(null);

  const subscriptions = subscriptionsQuery.data?.subscriptions ?? [];

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

  const handleAdd = () => {
    setDialogMode("create");
    setEditingSubscription(null);
    setDialogOpen(true);
  };

  const handleEdit = (sub: Subscription) => {
    setDialogMode("edit");
    setEditingSubscription(sub);
    setDialogOpen(true);
  };

  const handleToggle = (sub: Subscription) => {
    updateMutation.mutate({
      id: sub.id,
      input: { isActive: !sub.isActive },
    });
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
        <Button size="lg" onClick={handleAdd}>
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
            <Button onClick={handleAdd}>
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
          onEdit={handleEdit}
          onToggle={handleToggle}
          onDelete={setToDelete}
        />
      )}

      <SubscriptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={editingSubscription}
      />

      <DeleteSubscriptionDialog
        subscription={toDelete}
        isPending={deleteMutation.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
