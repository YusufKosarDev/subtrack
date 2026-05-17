import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  BarChart3,
  CreditCard,
  Keyboard,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Plus,
  Settings,
  Sun,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommandPaletteStore } from "@/store/command-palette.store";
import { useLogout } from "@/features/auth/use-auth";

export function CommandPalette() {
  const open = useCommandPaletteStore((s) => s.open);
  const setOpen = useCommandPaletteStore((s) => s.setOpen);
  const setAddSubscriptionOpen = useCommandPaletteStore(
    (s) => s.setAddSubscriptionOpen
  );
  const setShortcutsOpen = useCommandPaletteStore((s) => s.setShortcutsOpen);
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const logout = useLogout();

  const runCommand = useCallback(
    (fn: () => void) => {
      setOpen(false);
      requestAnimationFrame(fn);
    },
    [setOpen]
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Search or pick an action"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick actions">
          <CommandItem
            onSelect={() => runCommand(() => setAddSubscriptionOpen(true))}
          >
            <Plus className="h-4 w-4" />
            Add subscription
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/subscriptions"))}>
            <CreditCard className="h-4 w-4" />
            View subscriptions
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/analytics"))}>
            <BarChart3 className="h-4 w-4" />
            View analytics
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/subscriptions"))}>
            <CreditCard className="h-4 w-4" />
            Subscriptions
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/analytics"))}>
            <BarChart3 className="h-4 w-4" />
            Analytics
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
            <Settings className="h-4 w-4" />
            Settings
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Help">
          <CommandItem
            onSelect={() => runCommand(() => setShortcutsOpen(true))}
          >
            <Keyboard className="h-4 w-4" />
            Keyboard shortcuts
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="h-4 w-4" />
            Light
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="h-4 w-4" />
            Dark
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Monitor className="h-4 w-4" />
            System
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem
            onSelect={() => runCommand(() => logout())}
            className="text-destructive data-[selected=true]:bg-destructive/10 data-[selected=true]:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
