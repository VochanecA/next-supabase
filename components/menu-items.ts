// app/components/menu-items.ts
import { LayoutDashboard, Home } from "lucide-react";

export const navItems = ["Why", "About", "Features", "Pricing"];

export const userMenuItems = [
  { label: "Dashboard", href: "/protected", icon: LayoutDashboard },
  { label: "Web App", href: "/protected/web-app", requiresSubscription: true, icon: Home },
];
