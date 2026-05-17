import { useCallback, useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "@/components/shared/command-palette";
import { KeyboardShortcutsDialog } from "@/components/shared/keyboard-shortcuts-dialog";
import { SubscriptionDialog } from "@/features/subscriptions/components/subscription-dialog";
import { useHotkey, useSequenceHotkey } from "@/hooks/use-hotkey";
import { useCommandPaletteStore } from "@/store/command-palette.store";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const toggleCommand = useCommandPaletteStore((s) => s.toggle);
  const addSubscriptionOpen = useCommandPaletteStore(
    (s) => s.addSubscriptionOpen
  );
  const setAddSubscriptionOpen = useCommandPaletteStore(
    (s) => s.setAddSubscriptionOpen
  );
  const shortcutsOpen = useCommandPaletteStore((s) => s.shortcutsOpen);
  const setShortcutsOpen = useCommandPaletteStore((s) => s.setShortcutsOpen);

  const handleHotkeyCmdK = useCallback(() => toggleCommand(), [toggleCommand]);
  const handleHotkeyHelp = useCallback(
    () => setShortcutsOpen(true),
    [setShortcutsOpen]
  );
  const handleHotkeyNew = useCallback(
    () => setAddSubscriptionOpen(true),
    [setAddSubscriptionOpen]
  );

  useHotkey("k", handleHotkeyCmdK, { meta: true });
  useHotkey("?", handleHotkeyHelp, { meta: false, preventDefault: true });
  useHotkey("n", handleHotkeyNew, { meta: false });

  const sequences = useMemo(
    () => ({
      gd: () => navigate("/dashboard"),
      gs: () => navigate("/subscriptions"),
      ga: () => navigate("/analytics"),
      gc: () => navigate("/settings"),
    }),
    [navigate]
  );

  useSequenceHotkey(sequences);

  return (
    <div className="min-h-screen">
      <Sidebar className="hidden md:flex" />
      <div className="md:ml-64">
        <Topbar />
        <main className="mx-auto w-full max-w-7xl p-6 lg:p-8">{children}</main>
      </div>

      <CommandPalette />
      <KeyboardShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
      <SubscriptionDialog
        open={addSubscriptionOpen}
        onOpenChange={setAddSubscriptionOpen}
        mode="create"
      />
    </div>
  );
}
