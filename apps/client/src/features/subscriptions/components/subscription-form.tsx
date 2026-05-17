import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/shared/date-picker";
import { CurrencyInput } from "@/components/shared/currency-input";
import {
  BILLING_CYCLES,
  COMMON_CATEGORIES,
  CURRENCIES,
} from "@/config/constants";
import {
  createSubscriptionSchema,
  type CreateSubscriptionInput,
} from "../schemas";
import type { Subscription } from "@/types/subscription";

interface SubscriptionFormProps {
  mode: "create" | "edit";
  initialData?: Subscription;
  onSubmit: (data: CreateSubscriptionInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfTomorrow(): Date {
  const d = startOfToday();
  d.setDate(d.getDate() + 1);
  return d;
}

function defaultNextPayment(): Date {
  const d = startOfToday();
  d.setMonth(d.getMonth() + 1);
  return d;
}

type FormShape = {
  name: string;
  price: number | string;
  currency: string;
  billingCycle: Subscription["billingCycle"];
  category: string;
  startDate: Date;
  nextPaymentDate: Date;
  isTrial: boolean;
  trialEndsAt: Date | null;
  notes: string;
};

function buildDefaults(initialData?: Subscription): FormShape {
  if (!initialData) {
    return {
      name: "",
      price: "",
      currency: "TRY",
      billingCycle: "MONTHLY",
      category: "",
      startDate: startOfToday(),
      nextPaymentDate: defaultNextPayment(),
      isTrial: false,
      trialEndsAt: null,
      notes: "",
    };
  }
  return {
    name: initialData.name,
    price: parseFloat(initialData.price),
    currency: initialData.currency,
    billingCycle: initialData.billingCycle,
    category: initialData.category ?? "",
    startDate: new Date(initialData.startDate),
    nextPaymentDate: new Date(initialData.nextPaymentDate),
    isTrial: initialData.isTrial,
    trialEndsAt: initialData.trialEndsAt
      ? new Date(initialData.trialEndsAt)
      : null,
    notes: initialData.notes ?? "",
  };
}

export function SubscriptionForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: SubscriptionFormProps) {
  const today = useMemo(startOfToday, []);
  const tomorrow = useMemo(startOfTomorrow, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormShape, unknown, CreateSubscriptionInput>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: buildDefaults(initialData),
  });

  const currency = watch("currency");
  const isTrial = watch("isTrial");

  const categoryOptions = useMemo(() => {
    const set = new Set(COMMON_CATEGORIES);
    if (initialData?.category) set.add(initialData.category);
    return Array.from(set);
  }, [initialData]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      noValidate
    >
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="sub-name">Name *</Label>
        <Input
          id="sub-name"
          placeholder="Netflix, Spotify, Gym membership..."
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-price">Price *</Label>
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <CurrencyInput
              id="sub-price"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              currency={currency}
              disabled={isSubmitting}
              aria-invalid={!!errors.price}
            />
          )}
        />
        {errors.price && (
          <p className="mt-1 text-xs text-destructive">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-currency">Currency</Label>
        <Controller
          control={control}
          name="currency"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger id="sub-currency" aria-invalid={!!errors.currency}>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.currency && (
          <p className="mt-1 text-xs text-destructive">
            {errors.currency.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-cycle">Billing cycle *</Label>
        <Controller
          control={control}
          name="billingCycle"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger id="sub-cycle" aria-invalid={!!errors.billingCycle}>
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                {BILLING_CYCLES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.billingCycle && (
          <p className="mt-1 text-xs text-destructive">
            {errors.billingCycle.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-category">Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              value={field.value || "__none__"}
              onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="sub-category" aria-invalid={!!errors.category}>
                <SelectValue placeholder="Pick a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Uncategorized</SelectItem>
                {categoryOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="mt-1 text-xs text-destructive">
            {errors.category.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-start">Start date *</Label>
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePicker
              id="sub-start"
              value={field.value}
              onChange={(d) => field.onChange(d)}
              toDate={today}
              disabled={isSubmitting}
              placeholder="Pick start date"
            />
          )}
        />
        {errors.startDate && (
          <p className="mt-1 text-xs text-destructive">
            {errors.startDate.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-next">Next payment date *</Label>
        <Controller
          control={control}
          name="nextPaymentDate"
          render={({ field }) => (
            <DatePicker
              id="sub-next"
              value={field.value}
              onChange={(d) => field.onChange(d)}
              fromDate={tomorrow}
              disabled={isSubmitting}
              placeholder="Pick next payment"
            />
          )}
        />
        {errors.nextPaymentDate && (
          <p className="mt-1 text-xs text-destructive">
            {errors.nextPaymentDate.message}
          </p>
        )}
      </div>

      <div className="space-y-3 md:col-span-2">
        <div className="flex items-center justify-between rounded-lg border border-border/40 bg-card/30 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Free trial period</p>
            <p className="text-xs text-muted-foreground">
              Enable if this subscription starts as a trial.
            </p>
          </div>
          <Controller
            control={control}
            name="isTrial"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
                aria-label="Toggle free trial"
              />
            )}
          />
        </div>

        <AnimatePresence initial={false}>
          {isTrial && (
            <motion.div
              key="trial-end"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-1">
                <Label htmlFor="sub-trial-end">Trial ends at *</Label>
                <Controller
                  control={control}
                  name="trialEndsAt"
                  render={({ field }) => (
                    <DatePicker
                      id="sub-trial-end"
                      value={field.value ?? undefined}
                      onChange={(d) => field.onChange(d ?? null)}
                      fromDate={tomorrow}
                      disabled={isSubmitting}
                      placeholder="Pick trial end date"
                    />
                  )}
                />
                {errors.trialEndsAt && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.trialEndsAt.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="sub-notes">Notes (optional)</Label>
        <Textarea
          id="sub-notes"
          rows={3}
          placeholder="Any additional notes..."
          aria-invalid={!!errors.notes}
          {...register("notes")}
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <div className="mt-2 flex justify-end gap-2 md:col-span-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-32">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : mode === "create" ? (
            "Add subscription"
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}
