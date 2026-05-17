export type BillingCycle =
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"
  | "CUSTOM";

export interface Subscription {
  id: string;
  name: string;
  price: string;
  currency: string;
  billingCycle: BillingCycle;
  category: string | null;
  startDate: string;
  nextPaymentDate: string;
  isActive: boolean;
  isTrial: boolean;
  trialEndsAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
