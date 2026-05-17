import { Badge } from "@/components/ui/badge";

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function CategoryBadge({ category }: { category: string | null }) {
  if (!category || !category.trim()) {
    return (
      <Badge variant="outline" className="px-2 py-0.5 text-xs font-medium">
        Uncategorized
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium">
      {capitalize(category)}
    </Badge>
  );
}
