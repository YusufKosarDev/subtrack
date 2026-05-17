import { Search } from "lucide-react";
import { useCommandPaletteStore } from "@/store/command-palette.store";
import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Topbar() {
  const setCommandOpen = useCommandPaletteStore((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-card/40 px-4 backdrop-blur-xl md:px-6">
      <div className="flex flex-1 items-center gap-3">
        <MobileSidebar />
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="relative hidden h-9 w-full max-w-md items-center gap-2 rounded-md border border-input bg-transparent pl-3 pr-2 text-sm text-muted-foreground shadow-xs transition-colors hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:flex"
          aria-label="Open command palette"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
