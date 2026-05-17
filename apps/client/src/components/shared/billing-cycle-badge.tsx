import { Badge } from "@/components/ui/badge";
import type { BillingCycle } from "@/types/subscription";

const cycleMap: Record<
  BillingCycle,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  WEEKLY: { label: "Weekly", variant: "secondary" },
  MONTHLY: { label: "Monthly", variant: "default" },
  QUARTERLY: { label: "Quarterly", variant: "outline" },
  YEARLY: { label: "Yearly", variant: "secondary" },
  CUSTOM: { label: "Custom", variant: "outline" },
};

export function BillingCycleBadge({ cycle }: { cycle: BillingCycle }) {
  const { label, variant } = cycleMap[cycle];
  return (
    <Badge variant={variant} className="px-2 py-0.5 text-xs font-medium">
      {label}
    </Badge>
  );
}
