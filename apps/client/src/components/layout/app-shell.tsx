import { useCallback, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "@/components/shared/command-palette";
import { SubscriptionDialog } from "@/features/subscriptions/components/subscription-dialog";
import { useHotkey } from "@/hooks/use-hotkey";
import { useCommandPaletteStore } from "@/store/command-palette.store";

export function AppShell({ children }: { children: ReactNode }) {
  const toggleCommand = useCommandPaletteStore((s) => s.toggle);
  const addSubscriptionOpen = useCommandPaletteStore(
    (s) => s.addSubscriptionOpen
  );
  const setAddSubscriptionOpen = useCommandPaletteStore(
    (s) => s.setAddSubscriptionOpen
  );

  const handleHotkey = useCallback(() => toggleCommand(), [toggleCommand]);
  useHotkey("k", handleHotkey, { meta: true });

  return (
    <div className="min-h-screen">
      <Sidebar className="hidden md:flex" />
      <div className="md:ml-64">
        <Topbar />
        <main className="mx-auto w-full max-w-7xl p-6 lg:p-8">{children}</main>
      </div>

      <CommandPalette />
      <SubscriptionDialog
        open={addSubscriptionOpen}
        onOpenChange={setAddSubscriptionOpen}
        mode="create"
      />
    </div>
  );
}
