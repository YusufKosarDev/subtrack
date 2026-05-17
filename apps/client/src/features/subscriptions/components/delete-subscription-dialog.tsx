import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Subscription } from "@/types/subscription";

interface DeleteSubscriptionDialogProps {
  subscription: Subscription | null;
  isPending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteSubscriptionDialog({
  subscription,
  isPending = false,
  onCancel,
  onConfirm,
}: DeleteSubscriptionDialogProps) {
  return (
    <AlertDialog
      open={subscription !== null}
      onOpenChange={(open) => {
        if (!open && !isPending) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              &ldquo;{subscription?.name ?? ""}&rdquo;
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
