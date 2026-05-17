import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col gap-6 border-r border-border/30 bg-gradient-to-b from-card/60 via-card/40 to-card/60 p-4 shadow-2xl shadow-primary/5 backdrop-blur-xl",
        className
      )}
    >
      <div className="space-y-2 px-2 pt-2">
        <BrandLogo size="md" />
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/5 px-1.5 py-0 text-[10px] font-medium text-primary"
        >
          v1.0 Beta
        </Badge>
      </div>

      <SidebarNav />

      {user && (
        <div className="flex items-center gap-2.5 rounded-lg border border-border/30 bg-card/40 p-2.5 backdrop-blur-sm">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-xs font-semibold">
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
