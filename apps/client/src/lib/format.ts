import {
  format as dateFnsFormat,
  formatDistanceToNow,
  parseISO,
} from "date-fns";

export function formatCurrency(
  amount: string | number,
  currency: string
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(num)) return `0.00 ${currency.toUpperCase()}`;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${num.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export function formatCurrencyCompact(
  amount: number,
  currency: string
): string {
  if (!Number.isFinite(amount)) return `0 ${currency.toUpperCase()}`;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return `${amount.toFixed(0)} ${currency.toUpperCase()}`;
  }
}

export type DateFormatMode = "short" | "long" | "relative";

export function formatDate(
  dateStr: string,
  mode: DateFormatMode = "short"
): string {
  const date = parseISO(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  if (mode === "relative") return formatDistanceToNow(date, { addSuffix: true });
  if (mode === "long") return dateFnsFormat(date, "MMMM d, yyyy");
  return dateFnsFormat(date, "MMM d, yyyy");
}

export function formatRelativeDate(dateStr: string): string {
  return formatDate(dateStr, "relative");
}

export function getDaysUntil(dateStr: string): number {
  const date = parseISO(dateStr);
  if (Number.isNaN(date.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}
