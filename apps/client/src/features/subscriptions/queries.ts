import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import * as subscriptionsApi from "./api";
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from "./schemas";

const SUBSCRIPTIONS_KEY = ["subscriptions"] as const;

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    return data?.error ?? "Something went wrong";
  }
  return "Something went wrong";
}

export function useSubscriptions() {
  return useQuery({
    queryKey: SUBSCRIPTIONS_KEY,
    queryFn: () => subscriptionsApi.listSubscriptions(),
  });
}

export function useSubscription(id: string | undefined) {
  return useQuery({
    queryKey: ["subscriptions", id],
    queryFn: () => subscriptionsApi.getSubscription(id as string),
    enabled: !!id,
  });
}

export function useUpcomingPayments(days = 7) {
  return useQuery({
    queryKey: ["subscriptions", "upcoming", days],
    queryFn: () => subscriptionsApi.listUpcoming(days),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) =>
      subscriptionsApi.createSubscription(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      toast.success("Subscription added!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateSubscriptionInput;
    }) => subscriptionsApi.updateSubscription(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", variables.id],
      });
      toast.success("Subscription updated!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      toast.success("Subscription deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
