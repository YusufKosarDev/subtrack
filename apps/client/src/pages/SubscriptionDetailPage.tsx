import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Coins,
  Pencil,
  Power,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageTransition } from "@/components/shared/page-transition";
import { PageHeader } from "@/components/layout/page-header";
import { BillingCycleBadge } from "@/components/shared/billing-cycle-badge";
import { CategoryBadge } from "@/components/shared/category-badge";
import { SubscriptionDialog } from "@/features/subscriptions/components/subscription-dialog";
import { DeleteSubscriptionDialog } from "@/features/subscriptions/components/delete-subscription-dialog";
import {
  useDeleteSubscription,
  useSubscription,
  useUpdateSubscription,
} from "@/features/subscriptions/queries";
import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  getDaysUntil,
} from "@/lib/format";
import { normalizeToMonthly } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useSubscription(id);
  const updateMutation = useUpdateSubscription();
  const deleteMutation = useDeleteSubscription();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (query.isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (query.isError || !query.data) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/subscriptions">
              <ArrowLeft className="h-4 w-4" />
              Back to subscriptions
            </Link>
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Subscription not found</AlertTitle>
            <AlertDescription>
              We couldn&apos;t load this subscription. It may have been deleted.
            </AlertDescription>
          </Alert>
        </div>
      </PageTransition>
    );
  }

  const sub = query.data.subscription;
  const monthlyEquiv = normalizeToMonthly(parseFloat(sub.price), sub.billingCycle);
  const yearlyEquiv = monthlyEquiv * 12;
  const perDay = monthlyEquiv / 30;
  const days = getDaysUntil(sub.nextPaymentDate);

  const handleToggle = () => {
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
    deleteMutation.mutate(sub.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        navigate("/subscriptions");
      },
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title={sub.name}
          description={`Tracking since ${formatDate(sub.createdAt, "long")}`}
          breadcrumb={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/subscriptions">Subscriptions</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{sub.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
          actions={
            <>
              <Button variant="outline" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleToggle}>
                <Power className="h-4 w-4" />
                {sub.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(true)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          {sub.isActive ? (
            <Badge>Active</Badge>
          ) : (
            <Badge variant="outline">Inactive</Badge>
          )}
          {sub.isTrial && (
            <Badge variant="outline" className="border-amber-500/40 text-amber-500">
              <Sparkles className="h-3 w-3" />
              Trial
            </Badge>
          )}
          <BillingCycleBadge cycle={sub.billingCycle} />
          <CategoryBadge category={sub.category} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="space-y-5 p-6">
            <h2 className="text-base font-semibold tracking-tight">
              Cost breakdown
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/40 bg-card/30 p-4">
                <p className="text-xs text-muted-foreground">Per cycle</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {formatCurrency(sub.price, sub.currency)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {sub.billingCycle.toLowerCase()}
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-card/30 p-4">
                <p className="text-xs text-muted-foreground">Monthly equiv.</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {formatCurrency(monthlyEquiv, sub.currency)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatCurrency(perDay, sub.currency)} / day
                </p>
              </div>
              <div className="col-span-2 rounded-xl border border-border/40 bg-gradient-to-br from-primary/15 to-primary/5 p-4">
                <p className="text-xs text-muted-foreground">Yearly projection</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-gradient-primary">
                  {formatCurrency(yearlyEquiv, sub.currency)}
                </p>
              </div>
            </div>

            {sub.notes && (
              <div className="rounded-xl border border-border/40 bg-card/20 p-4">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Notes
                </p>
                <p className="whitespace-pre-wrap text-sm">{sub.notes}</p>
              </div>
            )}
          </Card>

          <Card className="space-y-5 p-6">
            <h2 className="text-base font-semibold tracking-tight">Timeline</h2>
            <ol className="relative space-y-4 pl-5">
              <span
                aria-hidden="true"
                className="absolute left-1.5 top-1 bottom-1 w-px bg-border/40"
              />
              <li className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[10px] top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-primary/40 ring-2 ring-background"
                />
                <p className="text-sm font-medium">Started</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(sub.startDate, "long")} ·{" "}
                  {formatRelativeDate(sub.startDate)}
                </p>
              </li>
              {sub.isTrial && sub.trialEndsAt && (
                <li className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[10px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-background"
                  />
                  <p className="text-sm font-medium">Trial ends</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(sub.trialEndsAt, "long")} ·{" "}
                    {formatRelativeDate(sub.trialEndsAt)}
                  </p>
                </li>
              )}
              <li className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-[10px] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-background",
                    days <= 3 ? "bg-destructive" : "bg-primary"
                  )}
                />
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                  Next payment
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(sub.nextPaymentDate, "long")} ·{" "}
                  {formatRelativeDate(sub.nextPaymentDate)}
                </p>
              </li>
              <li className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[10px] top-1.5 h-2.5 w-2.5 rounded-full bg-muted-foreground/30 ring-2 ring-background"
                />
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                  Last updated
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeDate(sub.updatedAt)}
                </p>
              </li>
            </ol>
          </Card>
        </div>

        <SubscriptionDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          mode="edit"
          initialData={sub}
        />

        <DeleteSubscriptionDialog
          subscription={deleteOpen ? sub : null}
          isPending={deleteMutation.isPending}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </PageTransition>
  );
}
