import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { formatRelativeDate } from "@/lib/format";
import type { Subscription } from "@/types/subscription";

interface RecentActivityProps {
  subscriptions: Subscription[];
  maxItems?: number;
}

interface ActivityEntry {
  id: string;
  name: string;
  description: string;
  timestamp: string;
}

export function RecentActivity({
  subscriptions,
  maxItems = 5,
}: RecentActivityProps) {
  const entries = useMemo<ActivityEntry[]>(() => {
    return subscriptions
      .flatMap<ActivityEntry>((sub) => {
        const events: ActivityEntry[] = [
          {
            id: `${sub.id}-created`,
            name: sub.name,
            description: "Subscription added",
            timestamp: sub.createdAt,
          },
        ];
        if (sub.updatedAt && sub.updatedAt !== sub.createdAt) {
          events.push({
            id: `${sub.id}-updated`,
            name: sub.name,
            description: sub.isActive ? "Updated" : "Deactivated",
            timestamp: sub.updatedAt,
          });
        }
        return events;
      })
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
      .slice(0, maxItems);
  }, [subscriptions, maxItems]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/40 bg-card/20 px-4 py-10 text-center">
        <Sparkles className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-3 pl-4">
      <span
        aria-hidden="true"
        className="absolute left-1.5 top-1 bottom-1 w-px bg-border/40"
      />
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[10px] top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-primary/40 ring-2 ring-background"
          />
          <p className="text-sm font-medium leading-tight">{entry.name}</p>
          <p className="text-xs text-muted-foreground">
            {entry.description} · {formatRelativeDate(entry.timestamp)}
          </p>
        </li>
      ))}
    </ol>
  );
}
