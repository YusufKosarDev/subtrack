import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDownUp,
  CheckCircle2,
  CreditCard,
  Plus,
  Power,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTransition } from "@/components/shared/page-transition";
import { PageHeader } from "@/components/layout/page-header";
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
import {
  calculateMonthlyTotal,
  mostCommonCurrency,
  normalizeToMonthly,
} from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";
import { useCommandPaletteStore } from "@/store/command-palette.store";
import type { Subscription } from "@/types/subscription";

type SortKey =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "nextPayment-asc"
  | "nextPayment-desc"
  | "created-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "created-desc", label: "Newest first" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "price-desc", label: "Price (high → low)" },
  { value: "price-asc", label: "Price (low → high)" },
  { value: "nextPayment-asc", label: "Next payment (soon)" },
  { value: "nextPayment-desc", label: "Next payment (later)" },
];

function priceOf(sub: Subscription): number {
  const n = parseFloat(sub.price);
  return Number.isFinite(n) ? n : 0;
}

function sortSubscriptions(subs: Subscription[], key: SortKey): Subscription[] {
  const copy = [...subs];
  switch (key) {
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "price-asc":
      return copy.sort(
        (a, b) =>
          normalizeToMonthly(priceOf(a), a.billingCycle) -
          normalizeToMonthly(priceOf(b), b.billingCycle)
      );
    case "price-desc":
      return copy.sort(
        (a, b) =>
          normalizeToMonthly(priceOf(b), b.billingCycle) -
          normalizeToMonthly(priceOf(a), a.billingCycle)
      );
    case "nextPayment-asc":
      return copy.sort(
        (a, b) =>
          Date.parse(a.nextPaymentDate) - Date.parse(b.nextPaymentDate)
      );
    case "nextPayment-desc":
      return copy.sort(
        (a, b) =>
          Date.parse(b.nextPaymentDate) - Date.parse(a.nextPaymentDate)
      );
    case "created-desc":
    default:
      return copy.sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
  }
}

interface BulkActionBarProps {
  count: number;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onClear: () => void;
}

function BulkActionBar({
  count,
  onActivate,
  onDeactivate,
  onDelete,
  onClear,
}: BulkActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-full border border-border/40 bg-card/80 px-4 py-2 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <span className="text-sm font-medium tabular-nums">
          {count} selected
        </span>
        <div className="h-5 w-px bg-border/40" />
        <Button size="sm" variant="ghost" onClick={onActivate}>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Activate
        </Button>
        <Button size="sm" variant="ghost" onClick={onDeactivate}>
          <Power className="h-4 w-4" />
          Deactivate
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        <div className="h-5 w-px bg-border/40" />
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onClear}
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export function SubscriptionsPage() {
  const subscriptionsQuery = useSubscriptions();
  const deleteMutation = useDeleteSubscription();
  const updateMutation = useUpdateSubscription();
  const setAddSubscriptionOpen = useCommandPaletteStore(
    (s) => s.setAddSubscriptionOpen
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [cycleFilter, setCycleFilter] = useState<CycleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created-desc");

  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [toDelete, setToDelete] = useState<Subscription | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const sorted = useMemo(() => sortSubscriptions(filtered, sortKey), [filtered, sortKey]);

  const stats = useMemo(() => {
    const currency = mostCommonCurrency(
      filtered.filter((s) => s.isActive).length > 0
        ? filtered.filter((s) => s.isActive)
        : filtered
    );
    const monthly = calculateMonthlyTotal(filtered);
    const active = filtered.filter((s) => s.isActive).length;
    const avg = active > 0 ? monthly / active : 0;
    return { monthly, avg, currency };
  }, [filtered]);

  const clearFilters = () => {
    setSearchQuery("");
    setCycleFilter("all");
    setStatusFilter("all");
  };

  const handleAdd = () => setAddSubscriptionOpen(true);

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
  };

  const handleToggle = (sub: Subscription) => {
    updateMutation.mutate(
      { id: sub.id, input: { isActive: !sub.isActive } },
      {
        onSuccess: () =>
          toast.success(
            sub.isActive ? `Deactivated ${sub.name}` : `Activated ${sub.name}`
          ),
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteMutation.mutate(toDelete.id, {
      onSuccess: () => setToDelete(null),
    });
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(
      checked ? new Set(sorted.map((s) => s.id)) : new Set()
    );
  };

  const clearSelection = () => setSelectedIds(new Set());

  const bulkApplyActive = (nextActive: boolean) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    Promise.allSettled(
      ids.map((id) =>
        updateMutation.mutateAsync({ id, input: { isActive: nextActive } })
      )
    ).then(() => {
      toast.success(
        `${ids.length} subscription${ids.length === 1 ? "" : "s"} ${nextActive ? "activated" : "deactivated"}`
      );
      clearSelection();
    });
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    Promise.allSettled(
      ids.map((id) => deleteMutation.mutateAsync(id))
    ).then(() => {
      toast.success(
        `${ids.length} subscription${ids.length === 1 ? "" : "s"} deleted`
      );
      clearSelection();
      setBulkDeleteOpen(false);
    });
  };

  const hasFilters =
    !!searchQuery || cycleFilter !== "all" || statusFilter !== "all";

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Subscriptions"
          description="Manage your recurring expenses in one place."
          actions={
            <Button
              size="lg"
              onClick={handleAdd}
              className="shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30"
            >
              <Plus className="h-4 w-4" />
              Add subscription
            </Button>
          }
        />

        {subscriptions.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/30 bg-card/40 px-4 py-3 text-sm backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <span className="text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {sorted.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {subscriptions.length}
                </span>
              </span>
              <span className="text-muted-foreground">
                Total monthly{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatCurrency(stats.monthly, stats.currency)}
                </span>
              </span>
              <span className="text-muted-foreground">
                Avg per sub{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {formatCurrency(stats.avg, stats.currency)}
                </span>
              </span>
            </div>
            <Select
              value={sortKey}
              onValueChange={(v) => setSortKey(v as SortKey)}
            >
              <SelectTrigger className="h-9 w-[200px]" aria-label="Sort">
                <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No results match your filters"
            description="Try changing or clearing your filters to see more subscriptions."
            action={
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasFilters}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <SubscriptionTable
            subscriptions={sorted}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={setToDelete}
            selectedIds={selectedIds}
            onToggleSelected={toggleSelected}
            onToggleAll={toggleAll}
          />
        )}

        <SubscriptionDialog
          open={editingSubscription !== null}
          onOpenChange={(open) => {
            if (!open) setEditingSubscription(null);
          }}
          mode="edit"
          initialData={editingSubscription}
        />

        <DeleteSubscriptionDialog
          subscription={toDelete}
          isPending={deleteMutation.isPending}
          onCancel={() => setToDelete(null)}
          onConfirm={handleConfirmDelete}
        />

        <DeleteSubscriptionDialog
          subscription={
            bulkDeleteOpen
              ? ({
                  name: `${selectedIds.size} subscription${selectedIds.size === 1 ? "" : "s"}`,
                } as Subscription)
              : null
          }
          isPending={deleteMutation.isPending}
          onCancel={() => setBulkDeleteOpen(false)}
          onConfirm={handleBulkDelete}
        />

        <AnimatePresence>
          {selectedIds.size > 0 && (
            <BulkActionBar
              count={selectedIds.size}
              onActivate={() => bulkApplyActive(true)}
              onDeactivate={() => bulkApplyActive(false)}
              onDelete={() => setBulkDeleteOpen(true)}
              onClear={clearSelection}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
