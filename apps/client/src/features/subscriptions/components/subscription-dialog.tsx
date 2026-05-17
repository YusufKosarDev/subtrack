import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionForm } from "./subscription-form";
import {
  useCreateSubscription,
  useUpdateSubscription,
} from "../queries";
import type { CreateSubscriptionInput } from "../schemas";
import type { Subscription } from "@/types/subscription";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: Subscription | null;
}

export function SubscriptionDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: SubscriptionDialogProps) {
  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (data: CreateSubscriptionInput) => {
    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: () => onOpenChange(false),
      });
    } else if (initialData) {
      updateMutation.mutate(
        { id: initialData.id, input: data },
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isSubmitting) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add subscription" : "Edit subscription"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Track a new recurring expense."
              : "Update subscription details."}
          </DialogDescription>
        </DialogHeader>

        <SubscriptionForm
          key={initialData?.id ?? "create"}
          mode={mode}
          initialData={initialData ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
