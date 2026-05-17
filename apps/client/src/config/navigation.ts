import { BarChart3, CreditCard, LayoutDashboard, Settings } from "lucide-react";
import type { NavItem } from "@/types/navigation";

export const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];
