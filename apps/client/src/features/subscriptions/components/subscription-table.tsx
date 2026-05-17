import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BillingCycleBadge } from "@/components/shared/billing-cycle-badge";
import { CategoryBadge } from "@/components/shared/category-badge";
import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  getDaysUntil,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (subscription: Subscription) => void;
  onToggle?: (subscription: Subscription) => void;
}

function getDueClass(days: number): string {
  if (days <= 3) return "text-destructive";
  if (days <= 7) return "text-orange-500";
  return "text-muted-foreground";
}

export function SubscriptionTable({
  subscriptions,
  onEdit,
  onDelete,
  onToggle,
}: SubscriptionTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Next Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
            {subscriptions.map((sub, index) => {
              const days = getDaysUntil(sub.nextPaymentDate);
              return (
                <motion.tr
                  key={sub.id}
                  data-slot="table-row"
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: Math.min(index * 0.03, 0.3),
                  }}
                  className="border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sub.name}</span>
                      {sub.isTrial && (
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0 text-[10px] font-medium"
                        >
                          Trial
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(sub.price, sub.currency)}
                  </TableCell>
                  <TableCell>
                    <BillingCycleBadge cycle={sub.billingCycle} />
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={sub.category} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm">
                        {formatDate(sub.nextPaymentDate, "short")}
                      </span>
                      <span className={cn("text-xs", getDueClass(days))}>
                        {formatRelativeDate(sub.nextPaymentDate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {sub.isActive ? (
                      <Badge variant="default" className="px-2 py-0.5 text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="px-2 py-0.5 text-xs">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${sub.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => onEdit?.(sub)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggle?.(sub)}>
                          <Power className="h-4 w-4" />
                          {sub.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(sub)}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
