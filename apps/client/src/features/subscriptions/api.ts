import { api } from "@/lib/api";
import type { Subscription } from "@/types/subscription";
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from "./schemas";

export interface SubscriptionListResponse {
  count: number;
  subscriptions: Subscription[];
}

export interface UpcomingPaymentsResponse {
  count: number;
  daysAhead: number;
  subscriptions: Subscription[];
}

export interface SubscriptionResponse {
  subscription: Subscription;
}

export interface SubscriptionMutationResponse {
  message: string;
  subscription: Subscription;
}

function serializeCreate(input: CreateSubscriptionInput): Record<string, unknown> {
  return {
    name: input.name,
    price: input.price,
    currency: input.currency,
    billingCycle: input.billingCycle,
    category: input.category && input.category.length > 0 ? input.category : undefined,
    startDate: input.startDate.toISOString(),
    nextPaymentDate: input.nextPaymentDate.toISOString(),
    isTrial: input.isTrial,
    trialEndsAt: input.trialEndsAt
      ? input.trialEndsAt.toISOString()
      : undefined,
    notes: input.notes && input.notes.length > 0 ? input.notes : undefined,
  };
}

function serializeUpdate(input: UpdateSubscriptionInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.price !== undefined) payload.price = input.price;
  if (input.currency !== undefined) payload.currency = input.currency;
  if (input.billingCycle !== undefined) payload.billingCycle = input.billingCycle;
  if (input.category !== undefined) {
    payload.category = input.category && input.category.length > 0 ? input.category : null;
  }
  if (input.startDate !== undefined) {
    payload.startDate = input.startDate?.toISOString();
  }
  if (input.nextPaymentDate !== undefined) {
    payload.nextPaymentDate = input.nextPaymentDate?.toISOString();
  }
  if (input.isTrial !== undefined) payload.isTrial = input.isTrial;
  if (input.trialEndsAt !== undefined) {
    payload.trialEndsAt = input.trialEndsAt
      ? input.trialEndsAt.toISOString()
      : null;
  }
  if (input.notes !== undefined) {
    payload.notes = input.notes && input.notes.length > 0 ? input.notes : null;
  }
  if (input.isActive !== undefined) payload.isActive = input.isActive;
  return payload;
}

export async function listSubscriptions(): Promise<SubscriptionListResponse> {
  const { data } = await api.get<SubscriptionListResponse>("/subscriptions");
  return data;
}

export async function getSubscription(
  id: string
): Promise<SubscriptionResponse> {
  const { data } = await api.get<SubscriptionResponse>(`/subscriptions/${id}`);
  return data;
}

export async function listUpcoming(days = 7): Promise<UpcomingPaymentsResponse> {
  const { data } = await api.get<UpcomingPaymentsResponse>(
    "/subscriptions/upcoming",
    { params: { days } }
  );
  return data;
}

export async function createSubscription(
  input: CreateSubscriptionInput
): Promise<SubscriptionMutationResponse> {
  const { data } = await api.post<SubscriptionMutationResponse>(
    "/subscriptions",
    serializeCreate(input)
  );
  return data;
}

export async function updateSubscription(
  id: string,
  input: UpdateSubscriptionInput
): Promise<SubscriptionMutationResponse> {
  const { data } = await api.put<SubscriptionMutationResponse>(
    `/subscriptions/${id}`,
    serializeUpdate(input)
  );
  return data;
}

export async function deleteSubscription(id: string): Promise<void> {
  await api.delete(`/subscriptions/${id}`);
}
