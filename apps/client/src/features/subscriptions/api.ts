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
    input
  );
  return data;
}

export async function updateSubscription(
  id: string,
  input: UpdateSubscriptionInput
): Promise<SubscriptionMutationResponse> {
  const { data } = await api.put<SubscriptionMutationResponse>(
    `/subscriptions/${id}`,
    input
  );
  return data;
}

export async function deleteSubscription(id: string): Promise<void> {
  await api.delete(`/subscriptions/${id}`);
}
