import type { BillingCycle } from "@/types/subscription";

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
  { value: "CUSTOM", label: "Custom" },
];

export const CURRENCIES: { value: string; label: string }[] = [
  { value: "TRY", label: "TRY — Turkish Lira" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
];

export const COMMON_CATEGORIES: string[] = [
  "Entertainment",
  "Music",
  "Productivity",
  "Fitness",
  "Education",
  "News",
  "Cloud Storage",
  "AI Tools",
  "Other",
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
};
