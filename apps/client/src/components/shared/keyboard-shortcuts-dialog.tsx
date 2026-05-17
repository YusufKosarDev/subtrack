import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShortcutRow {
  label: string;
  keys: string[];
}

interface ShortcutSection {
  title: string;
  shortcuts: ShortcutRow[];
}

const SECTIONS: ShortcutSection[] = [
  {
    title: "Navigation",
    shortcuts: [
      { label: "Go to dashboard", keys: ["g", "d"] },
      { label: "Go to subscriptions", keys: ["g", "s"] },
      { label: "Go to analytics", keys: ["g", "a"] },
      { label: "Go to settings", keys: ["g", "c"] },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { label: "Open command palette", keys: ["⌘", "K"] },
      { label: "Add subscription", keys: ["n"] },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { label: "Show keyboard shortcuts", keys: ["?"] },
      { label: "Close dialog / cancel", keys: ["Esc"] },
    ],
  },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Move faster across SubTrack with these shortcuts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h3>
              <ul className="space-y-1.5">
                {section.shortcuts.map((s) => (
                  <li
                    key={s.label}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted/30"
                  >
                    <span>{s.label}</span>
                    <span className="flex items-center gap-1">
                      {s.keys.map((k, i) => (
                        <Kbd key={`${s.label}-${i}`}>{k}</Kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
