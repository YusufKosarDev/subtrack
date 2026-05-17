import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { mainNavItems } from "@/config/navigation";

interface SidebarNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-1 flex-col gap-1", className)}>
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px]">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
