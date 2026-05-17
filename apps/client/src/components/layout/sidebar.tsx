import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import { getUserInitials } from "@/lib/user";
import { SidebarNav } from "./sidebar-nav";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col gap-6 border-r border-border/40 bg-card/40 p-4 backdrop-blur-xl",
        className
      )}
    >
      <div className="px-2 pt-2">
        <BrandLogo size="md" />
      </div>

      <SidebarNav />

      {user && (
        <div className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-card/30 p-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs">
              {getUserInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">
              {user.name ?? "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
