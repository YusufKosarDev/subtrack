import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CycleFilter =
  | "all"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"
  | "CUSTOM";
export type StatusFilter = "all" | "active" | "inactive";

interface SubscriptionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cycleFilter: CycleFilter;
  onCycleChange: (value: CycleFilter) => void;
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  onClear?: () => void;
}

export function SubscriptionFilters({
  searchQuery,
  onSearchChange,
  cycleFilter,
  onCycleChange,
  statusFilter,
  onStatusChange,
  onClear,
}: SubscriptionFiltersProps) {
  const hasFilters =
    !!searchQuery || cycleFilter !== "all" || statusFilter !== "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search subscriptions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9"
          aria-label="Search subscriptions"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={cycleFilter}
          onValueChange={(v) => onCycleChange(v as CycleFilter)}
        >
          <SelectTrigger className="h-9 w-[140px]" aria-label="Filter by cycle">
            <SelectValue placeholder="Cycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cycles</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
            <SelectItem value="YEARLY">Yearly</SelectItem>
            <SelectItem value="CUSTOM">Custom</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusChange(v as StatusFilter)}
        >
          <SelectTrigger className="h-9 w-[130px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
