import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { mainNavItems } from "@/config/navigation";

interface SidebarNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  const location = useLocation();
  return (
    <nav className={cn("flex flex-1 flex-col gap-0.5", className)}>
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          location.pathname === item.href ||
          (item.href !== "/" && location.pathname.startsWith(`${item.href}/`));
        return (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="sidebar-active-indicator"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-200",
                isActive ? "bg-primary" : "bg-transparent"
              )}
            />
            <Icon
              className={cn(
                "relative h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-primary" : ""
              )}
            />
            <span className="relative truncate">{item.title}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className="relative ml-auto h-5 px-1.5 text-[10px]"
              >
                {item.badge}
              </Badge>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
