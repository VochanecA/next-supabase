"use client";

import Link from "next/link";
import { Home, User, Settings, Bell, Activity } from "lucide-react";
import { JSX } from "react";

interface SidebarLink {
  href: string;
  label: string;
  icon: JSX.Element;
}

export function Sidebar(): JSX.Element {
  const mainLinks: SidebarLink[] = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/protected/notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { href: "/protected/analytics", label: "Analytics", icon: <Activity className="w-5 h-5" /> },
  ];

  const accountLinks: SidebarLink[] = [
    { href: "/protected", label: "Account", icon: <User className="w-5 h-5" /> },
    { href: "/protected/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const renderLink = ({ href, label, icon }: SidebarLink) => (
    <Link
      key={href}
      href={href}
      className="flex items-center gap-3 text-gray-900 dark:text-white hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors p-2"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-6 h-[calc(100vh-4rem)] sticky top-16">
      {/* Main Section */}
      <div>
        <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">
          Main
        </p>
        <div className="flex flex-col gap-1">
          {mainLinks.map(renderLink)}
        </div>
      </div>

      {/* Account Section */}
      <div>
        <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mt-4 mb-2">
          Account
        </p>
        <div className="flex flex-col gap-1">
          {accountLinks.map(renderLink)}
        </div>
      </div>
    </aside>
  );
}
